import { test, expect } from '../../src/fixtures/base';
import { NotesApi } from '../../src/api/notesApi';
import { NOTES_COLLECTION, NOTE_ITEM, envelope, mockRoute, syntheticNote } from './helpers';

/**
 * MOCK project only. Pattern for every test:
 *  1. fresh user via API fixture (isolated; no shared state, parallel-safe)
 *  2. log in through the REAL UI/API (auth is live)
 *  3. install the route BEFORE the triggering action (reload / submit)
 *  4. assert captured request (proof of interception) + visible UI outcome
 * Routes are per-page, so they die with the page/context -> no leakage to live specs.
 */
test.describe('Network interception and mocking', () => {
  test.describe('M1 | Deterministic notes list', () => {
    // route.fulfill: the response is entirely synthetic, so titles are deterministic.
    test('renders two synthetic notes from a fulfilled list response', async ({ page, notesPage, user }) => {
      const t1 = 'Mock title ALPHA';
      const t2 = 'Mock title BRAVO';
      await notesPage.login(user);

      const list = await mockRoute(page, NOTES_COLLECTION, 'GET', (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json; charset=utf-8',
          body: envelope(200, 'Notes successfully retrieved', [syntheticNote(1, t1), syntheticNote(2, t2)]),
        }),
      );

      await page.reload(); // triggering action, route already installed

      await expect.poll(() => list.count, { message: 'list request was intercepted' }).toBeGreaterThan(0);
      expect(list.requests[0].method).toBe('GET');
      expect(list.requests[0].url).toMatch(NOTES_COLLECTION);
      await expect(notesPage.cards).toHaveCount(2);
      await notesPage.expectNote(t1, 'Synthetic description 1');
      await notesPage.expectNote(t2, 'Synthetic description 2');
    });

    // Empty behaviour (meaningful empty state).
    test('shows no cards when the list response is empty', async ({ page, notesPage, user, api }) => {
      // Real data exists server-side, so an empty UI proves the mock (not the backend) drove the view.
      await api.createNoteOk(user.token!, NotesApi.uniqueNote('Real but hidden'));
      await notesPage.login(user);

      const list = await mockRoute(page, NOTES_COLLECTION, 'GET', (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: envelope(200, 'Notes successfully retrieved', []) }),
      );
      await page.reload();

      await expect.poll(() => list.count).toBeGreaterThan(0);
      await expect(notesPage.addNoteButton).toBeVisible();
      await expect(notesPage.cards).toHaveCount(0);
    });

    // route.fetch: hit the real backend, then modify the response (shows the third mocking technique).
    test('route.fetch patches a real response into a deterministic title', async ({ page, notesPage, user, api }) => {
      const real = await api.createNoteOk(user.token!, NotesApi.uniqueNote('Real'));
      await notesPage.login(user);

      const patched = 'Patched by route.fetch';
      const list = await mockRoute(page, NOTES_COLLECTION, 'GET', async (route) => {
        const response = await route.fetch();
        const json = await response.json();
        json.data = json.data.map((n: { id: string; title: string }) => (n.id === real.id ? { ...n, title: patched } : n));
        await route.fulfill({ response, json });
      });
      await page.reload();

      await expect.poll(() => list.count).toBeGreaterThan(0);
      await notesPage.expectNote(patched);
    });

    // route.abort: network-level failure (no HTTP response at all).
    test('handles an aborted list request without rendering stale cards', async ({ page, notesPage, user, api }) => {
      await api.createNoteOk(user.token!, NotesApi.uniqueNote('Should not render'));
      await notesPage.login(user);

      const list = await mockRoute(page, NOTES_COLLECTION, 'GET', (route) => route.abort('connectionrefused'));
      await page.reload();

      await expect.poll(() => list.count).toBeGreaterThan(0);
      await expect(notesPage.cards).toHaveCount(0);
      await expect(page.getByText('Should not render')).toHaveCount(0);
    });
  });

  test.describe('M2 | Expired/invalid session', () => {
    test('401 on the notes endpoint is handled by the UI', async ({ page, notesPage, user }) => {
      await notesPage.login(user);

      const list = await mockRoute(page, NOTES_COLLECTION, 'GET', (route) =>
        route.fulfill({
          status: 401,
          contentType: 'application/json; charset=utf-8',
          body: envelope(401, 'Access token is not valid or has expired, you will need to login'),
        }),
      );
      await page.reload();

      await expect.poll(() => list.count).toBeGreaterThan(0);
      expect(list.requests[0].url).toMatch(NOTES_COLLECTION);

      // Observed-behaviour assertion: accept any DOCUMENTED handling (logout redirect, re-auth prompt, error message).
      const handled = await Promise.race([
        page.waitForURL(/login/, { timeout: 10_000 }).then(() => 'redirected-to-login'),
        page.getByRole('alert').first().waitFor({ timeout: 10_000 }).then(() => 'error-message'),
        page.getByText(/expired|not valid|login/i).first().waitFor({ timeout: 10_000 }).then(() => 'inline-text'),
      ]).catch(() => 'missing-handling');

      test.info().annotations.push({ type: 'observed-401-handling', description: handled });
      expect(handled, 'UI should surface or react to an expired session (record if missing)').not.toBe('missing-handling');
      await expect(notesPage.cards).toHaveCount(0); // no stale data shown
    });
  });

  test.describe('M3 | Failed create/update', () => {
    test('500 on create: UI does not claim success, nothing persisted, recovery works', async ({ page, notesPage, user, api }) => {
      const note = NotesApi.uniqueNote('Will fail');
      await notesPage.login(user);

      const create = await mockRoute(page, NOTES_COLLECTION, 'POST', (route) =>
        route.fulfill({
          status: 500,
          contentType: 'application/json; charset=utf-8',
          body: envelope(500, 'Internal Server Error'),
        }),
      );

      await notesPage.createNote(note.title, note.description);

      await expect.poll(() => create.count, { message: 'POST was intercepted' }).toBe(1);
      expect(create.requests[0].method).toBe('POST');
      expect(JSON.parse(create.requests[0].postData ?? '{}')).toMatchObject({ title: note.title, description: note.description });

      // UI must not claim success: no card for the failed note.
      await expect(notesPage.cardByTitle(note.title)).toHaveCount(0);

      // Mocked request never reached the server (route.fulfill does not forward).
      const serverList = await (await api.listNotes(user.token!)).json();
      expect(serverList.data.map((n: { title: string }) => n.title)).not.toContain(note.title);

      // Recovery: remove the mock and retry on the same page; the live backend now accepts it.
      await page.unroute(NOTES_COLLECTION);
      await page.reload();
      await notesPage.createNote(note.title, note.description);
      await notesPage.expectNote(note.title, note.description);
    });

    test('500 on update: UI keeps original note and server data is unchanged', async ({ page, notesPage, user, api }) => {
      const original = NotesApi.uniqueNote('Original');
      const attempted = NotesApi.uniqueNote('Attempted edit');
      const created = await api.createNoteOk(user.token!, original);
      await notesPage.login(user);

      const update = await mockRoute(page, NOTE_ITEM, 'PUT', (route) =>
        route.fulfill({ status: 500, contentType: 'application/json', body: envelope(500, 'Internal Server Error') }),
      );

      await notesPage.editNote(original.title, attempted.title, attempted.description);

      await expect.poll(() => update.count).toBe(1);
      expect(update.requests[0].url).toContain(created.id);

      // Reload (route still installed only for PUT) and verify the server still has the original.
      await page.reload();
      await notesPage.expectNote(original.title, original.description);
      await notesPage.expectNoNote(attempted.title);
      const server = await (await api.getNote(user.token!, created.id)).json();
      expect(server.data.title).toBe(original.title);
    });
  });
});

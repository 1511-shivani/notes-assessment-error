import { test, expect } from '../../src/fixtures/base';
import { NotesApi } from '../../src/api/notesApi';

test.describe('C | Integrated - cross-layer persistence (live)', () => {
  test('note created via API is visible in the UI', async ({ page, notesPage, api, user }) => {
    const note = NotesApi.uniqueNote('Int API->UI');
    await api.createNoteOk(user.token!, note);

    await notesPage.login(user);
    await notesPage.expectNote(note.title, note.description);
  });

  test('UI edit is reflected in the API', async ({ page, notesPage, api, user }) => {
    const note = NotesApi.uniqueNote('Int edit');
    const edited = NotesApi.uniqueNote('Int edited');
    const created = await api.createNoteOk(user.token!, note);

    await notesPage.login(user);
    await notesPage.editNote(note.title, edited.title, edited.description);
    await notesPage.expectNote(edited.title, edited.description);

    // Eventual consistency: poll the API instead of sleeping.
    await expect
      .poll(async () => (await (await api.getNote(user.token!, created.id)).json()).data?.title, { timeout: 15_000 })
      .toBe(edited.title);
  });

  test('UI delete is reflected in the API', async ({ notesPage, api, user }) => {
    const note = NotesApi.uniqueNote('Int delete');
    const created = await api.createNoteOk(user.token!, note);

    await notesPage.login(user);
    await notesPage.deleteNote(note.title);
    await notesPage.expectNoNote(note.title);

    await expect
      .poll(async () => (await api.getNote(user.token!, created.id)).status(), { timeout: 15_000 })
      .toBe(404);
  });
});

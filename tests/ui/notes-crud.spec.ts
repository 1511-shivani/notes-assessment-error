import { test, expect } from '../../src/fixtures/base';
import { NotesApi } from '../../src/api/notesApi';

// Setup choice (documented): user is registered through the UI form, then logged in through the UI.
// Teardown deletes the account through the API so no test data lingers.
test.describe('A | UI - Notes CRUD (live)', () => {
  test('create, edit, delete a note with persistence checks', async ({ page, notesPage, api }) => {
    const user = NotesApi.uniqueUser('ui');
    const created = NotesApi.uniqueNote('UI note');
    const edited = NotesApi.uniqueNote('UI edited');

    await test.step('register a unique user via UI and log in', async () => {
      await notesPage.register(user);
      await expect(page).toHaveURL(/login/);
      await notesPage.login(user);
    });

    try {
      await test.step('create note and verify it is listed', async () => {
        await notesPage.createNote(created.title, created.description);
        await notesPage.expectNote(created.title, created.description);
      });

      await test.step('edit note, reload, verify persistence', async () => {
        await notesPage.editNote(created.title, edited.title, edited.description);
        await notesPage.expectNote(edited.title, edited.description);
        await page.reload();
        await notesPage.expectNote(edited.title, edited.description);
        await notesPage.expectNoNote(created.title);
      });

      await test.step('delete note, verify absence, reload and confirm still absent', async () => {
        await notesPage.deleteNote(edited.title);
        await notesPage.expectNoNote(edited.title);
        await page.reload();
        await expect(notesPage.addNoteButton).toBeVisible(); // page loaded before asserting absence
        await notesPage.expectNoNote(edited.title);
      });
    } finally {
      const token = await api.login(user);
      await api.deleteAccount(token);
    }
  });
});

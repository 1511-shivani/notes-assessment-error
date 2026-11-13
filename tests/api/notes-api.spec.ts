import { test, expect } from '../../src/fixtures/base';
import { NotesApi } from '../../src/api/notesApi';

test.describe('B | API - Notes CRUD and auth (live)', () => {
  test('create user, get token, CRUD a note and validate fields', async ({ api, user }) => {
    const token = user.token!;
    const input = NotesApi.uniqueNote('API note');

    await test.step('create', async () => {
      const note = await api.createNoteOk(token, input);
      expect(note.id).toBeTruthy();
      expect(note).toMatchObject({ title: input.title, description: input.description, category: 'Home', completed: false });

      await test.step('list contains the note', async () => {
        const res = await api.listNotes(token);
        expect(res.status()).toBe(200);
        const body = await res.json();
        expect(body.data.map((n: { id: string }) => n.id)).toContain(note.id);
      });

      await test.step('get by id', async () => {
        const res = await api.getNote(token, note.id);
        expect(res.status()).toBe(200);
        expect((await res.json()).data.id).toBe(note.id);
      });

      await test.step('update', async () => {
        const upd = NotesApi.uniqueNote('API updated');
        const res = await api.updateNote(token, note.id, { ...upd, completed: true });
        expect(res.status()).toBe(200);
        const data = (await res.json()).data;
        expect(data).toMatchObject({ id: note.id, title: upd.title, description: upd.description, completed: true });
      });

      await test.step('delete and confirm gone', async () => {
        const del = await api.deleteNote(token, note.id);
        expect(del.status()).toBe(200);
        const after = await api.getNote(token, note.id);
        expect(after.status()).toBe(404);
      });
    });
  });

  test('protected operation without auth is rejected', async ({ api }) => {
    const res = await api.listNotesUnauthenticated();
    expect([401, 403]).toContain(res.status());
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  test('user A cannot view or change user B note', async ({ api }) => {
    const a = NotesApi.uniqueUser('a');
    const b = NotesApi.uniqueUser('b');
    expect((await api.register(a)).status()).toBe(201);
    expect((await api.register(b)).status()).toBe(201);
    const ta = await api.login(a);
    const tb = await api.login(b);
    try {
      const noteB = await api.createNoteOk(tb, NotesApi.uniqueNote('B private'));

      const get = await api.getNote(ta, noteB.id);
      expect([401, 403, 404]).toContain(get.status());

      const put = await api.updateNote(ta, noteB.id, NotesApi.uniqueNote('hijack'));
      expect([401, 403, 404]).toContain(put.status());

      const del = await api.deleteNote(ta, noteB.id);
      expect([401, 403, 404]).toContain(del.status());

      // B's note is untouched
      const still = await api.getNote(tb, noteB.id);
      expect(still.status()).toBe(200);
      expect((await still.json()).data.title).toBe(noteB.title);
    } finally {
      await api.deleteAccount(ta).catch(() => undefined);
      await api.deleteAccount(tb).catch(() => undefined);
    }
  });
});

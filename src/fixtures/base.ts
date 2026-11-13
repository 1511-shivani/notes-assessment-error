import { test as base, expect, APIRequestContext } from '@playwright/test';
import { NotesApi, TestUser } from '../api/notesApi';
import { NotesPage } from '../pages/NotesPage';

const API_URL = process.env.API_URL ?? 'https://practice.expandtesting.com/notes/api/';

type Fixtures = {
  api: NotesApi;
  apiContext: APIRequestContext;
  user: TestUser; // registered via API, token populated, cleaned up on teardown
  notesPage: NotesPage;
};

export const test = base.extend<Fixtures>({
  apiContext: async ({ playwright }, use) => {
    const ctx = await playwright.request.newContext({ baseURL: API_URL });
    await use(ctx);
    await ctx.dispose();
  },
  api: async ({ apiContext }, use) => use(new NotesApi(apiContext)),

  user: async ({ api }, use) => {
    const u = NotesApi.uniqueUser();
    const res = await api.register(u);
    expect(res.status(), 'register status').toBe(201);
    u.token = await api.login(u);
    await use(u);
    // teardown: remove throw-away account (and its notes)
    await api.deleteAccount(u.token!).catch(() => undefined);
  },

  notesPage: async ({ page }, use) => use(new NotesPage(page)),
});

export { expect };

import { defineConfig, devices } from '@playwright/test';

// Trailing slashes matter: relative paths like 'login' / 'notes' resolve under them.
export const UI_URL = process.env.UI_URL ?? 'https://practice.expandtesting.com/notes/app/';
export const API_URL = process.env.API_URL ?? 'https://practice.expandtesting.com/notes/api/';

const ui = { ...devices['Desktop Chrome'], baseURL: UI_URL };

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
  },
  projects: [
    // LIVE projects: hit the real site, never register mock routes.
    { name: 'ui', testDir: './tests/ui', use: ui },
    { name: 'api', testDir: './tests/api' },
    { name: 'integration', testDir: './tests/integration', use: ui },
    // MOCK project: isolated in tests/mocks, route interception only.
    { name: 'mocks', testDir: './tests/mocks', use: ui },
  ],
});

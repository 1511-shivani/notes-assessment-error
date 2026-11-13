# Notes App – Playwright + TypeScript Assessment (Assessment 5)

Live UI, API and cross-layer tests for <https://practice.expandtesting.com/notes/app> plus the mandatory
network interception / mocking module.

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env   # optional – defaults already point at the public site
```

No credentials are needed: every test registers a unique throw-away user (`<prefix>.<timestamp><rand>@example.com`)
and deletes the account on teardown.

| Env var   | Default                                              |
|-----------|------------------------------------------------------|
| `UI_URL`  | `https://practice.expandtesting.com/notes/app/`      |
| `API_URL` | `https://practice.expandtesting.com/notes/api/`      |

(Trailing slashes are required so relative paths such as `login` resolve correctly.)

## Commands

| Purpose              | Command                |
|----------------------|------------------------|
| All projects         | `npm test`             |
| UI CRUD (live)       | `npm run test:ui`      |
| API CRUD + auth      | `npm run test:api`     |
| Integration          | `npm run test:integration` |
| Mock module          | `npm run test:mocks`   |
| All live, no mocks   | `npm run test:live`    |
| HTML report          | `npm run report`       |
| Type check           | `npm run typecheck`    |

CI: set `CI=1` (1 retry, 2 workers, `forbidOnly`). HTML report, traces, screenshots and video are kept on failure
(`playwright-report/`, `test-results/`).

## Layout

```
src/api/notesApi.ts        API helper (register/login/CRUD/delete-account, unique data)
src/pages/NotesPage.ts     Page object (data-testid / role locators)
src/fixtures/base.ts       Fixtures: api, user (registered + token + teardown), notesPage
tests/ui/                  A – UI CRUD
tests/api/                 B – API CRUD, 401/403, cross-user isolation
tests/integration/         C – API→UI and UI→API persistence
tests/mocks/               M1–M3 – interception (only place routes are registered)
docs/TEST_PLAN.md          Routes, assumptions, limitations, coverage
docs/MOCKING_DESIGN.md     How mocks are designed and separated from live tests
```

## Rules honoured

* No `waitForTimeout`; waits are web-first assertions or `expect.poll`.
* Tests are independent and parallel-safe (fresh user per test, unique titles).
* Live projects (`ui`, `api`, `integration`) never import `tests/mocks/`; routes exist only in the `mocks` project.
* Every mock test asserts a captured request (proof of interception) **and** a visible UI outcome.

## Honest notes

* Selectors rely on the site's `data-testid` attributes (`login-email`, `note-card`, `add-new-note`, …). If the
  public site changes them, only `NotesPage.ts` needs updating.
* The public site is shared and can change or be slow; observed request shapes are recorded in `docs/TEST_PLAN.md`.
  M2 records how the UI actually reacts to a 401 (annotation `observed-401-handling`) instead of assuming a behaviour.

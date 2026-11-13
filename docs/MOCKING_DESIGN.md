# Mocking Design

## Why each technique

| Technique | Where | Reason |
|-----------|-------|--------|
| `route.fulfill()` | M1 list, empty list, M2 401, M3 500s | Fully deterministic; no backend call, so no server-side write |
| `route.fetch()` + `fulfill({response, json})` | M1 patch | Keeps realistic real payload but pins one field |
| `route.abort()` | M1 abort | Simulates network failure (no HTTP response) |
| `page.unroute()` | M3 recovery | Proves the UI recovers once the service is healthy |

## Rules applied

* Routes are installed **before** the triggering action (reload / submit).
* Patterns are narrow regexes (`/notes/api/notes/?$`, `/notes/api/notes/{id}`) and filtered by HTTP method; other
  methods use `route.fallback()`, static assets are never matched.
* `mockRoute()` returns a capture object (count, URL, method, body) – each test asserts it before asserting UI.
* Responses use the real envelope and content type; no unrelated endpoint is invented.
* Routes are page-scoped; every test gets a fresh page and a fresh user, so there are no order dependencies.

## Live vs mocked separation

* Dedicated Playwright project `mocks` → `tests/mocks/` only. `ui`, `api`, `integration` projects point at other dirs.
* Helpers (`helpers.ts`) live inside `tests/mocks/` and are imported only by `mocks.spec.ts`.
* Authentication in mock tests is real (live login); only the target request is mocked.
* Fulfilled mocks never reach the server, so nothing is written; M3 additionally verifies this via the live API.

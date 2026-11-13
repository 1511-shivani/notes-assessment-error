# Test Plan

## Supported routes

| Layer | Route | Used for |
|-------|-------|----------|
| UI | `/notes/app/register`, `/login`, `/` (notes list) | Register, login, CRUD |
| API | `POST users/register` (201), `POST users/login` (200, `data.token`) | Setup |
| API | `GET/POST notes`, `GET/PUT/DELETE notes/{id}` with header `x-auth-token` | CRUD |
| API | `DELETE users/delete-account` | Teardown |

## Observed request shapes (frontend → API)

* List: `GET /notes/api/notes` → `{ success, status, message, data: Note[] }`
* Create: `POST /notes/api/notes` body `{ title, description, category }`
* Update: `PUT /notes/api/notes/{id}` body `{ title, description, completed, category }`
* Error envelope: `{ success:false, status, message }`

Mocks reuse exactly these shapes and `application/json; charset=utf-8`. Re-verify in a trace if the site changes.

## Assumptions

1. Notes UI calls the same-origin API above (so no CORS handling is needed for fulfilled responses).
2. A new user can be created and removed freely; passwords satisfy the documented rules (`Passw0rd!123`).
3. Cross-user access returns 401/403/404 (documented result accepted by the assertions).
4. UI edits propagate to the API quickly; polled up to 15 s to allow eventual consistency.

## Coverage

| Spec | Area | Cases |
|------|------|-------|
| `tests/ui/notes-crud.spec.ts` | A | register+login via UI; create; edit + reload persistence; delete + fresh-load absence |
| `tests/api/notes-api.spec.ts` | B | token; create/list/get/update/delete with field validation; unauthenticated 401/403; user A vs user B isolation |
| `tests/integration/cross-layer.spec.ts` | C | API-created note visible in UI; UI edit and UI delete verified through API |
| `tests/mocks/mocks.spec.ts` | M1 | fulfilled two-note list; fulfilled empty list; `route.fetch` patch; `route.abort` |
| | M2 | 401 on list, UI handling recorded |
| | M3 | 500 on create (no success claim, not persisted, recovery); 500 on update (data unchanged) |

## Limitations

* Public shared site: rate limits or content resets may cause flakiness; retries enabled only in CI.
* The exact UI reaction to a 401 is not documented; M2 accepts redirect, alert or inline message and records which occurred.
* Locators depend on the site's `data-testid` values.
* Only Desktop Chrome is configured.

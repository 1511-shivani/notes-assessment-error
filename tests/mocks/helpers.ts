import { Page, Route, Request } from '@playwright/test';

/** Narrow patterns: only the notes collection / a single note. Static assets and other APIs are never matched. */
export const NOTES_COLLECTION = /\/notes\/api\/notes\/?$/;
export const NOTE_ITEM = /\/notes\/api\/notes\/[^/]+$/;

export interface Captured {
  count: number;
  requests: { url: string; method: string; postData: string | null }[];
}

export const syntheticNote = (n: number, title: string) => ({
  id: `mock-note-${n}`,
  title,
  description: `Synthetic description ${n}`,
  category: 'Home',
  completed: false,
  created_at: '2026-01-01T10:00:00.000Z',
  updated_at: '2026-01-01T10:00:00.000Z',
  user_id: 'mock-user',
});

/** Realistic envelope matching the real API: { success, status, message, data }. */
export const envelope = (status: number, message: string, data?: unknown) =>
  JSON.stringify({ success: status < 400, status, message, ...(data !== undefined ? { data } : {}) });

/**
 * Install a route for `method` on `pattern` BEFORE the triggering action.
 * Other methods on the same URL fall through (route.fallback) so unrelated calls keep working.
 * Returns a capture object that tests assert on to PROVE interception happened.
 */
export async function mockRoute(
  page: Page,
  pattern: RegExp,
  method: string,
  handler: (route: Route, req: Request) => Promise<void>,
): Promise<Captured> {
  const captured: Captured = { count: 0, requests: [] };
  await page.route(pattern, async (route, req) => {
    if (req.method() !== method) return route.fallback();
    captured.count += 1;
    captured.requests.push({ url: req.url(), method: req.method(), postData: req.postData() });
    await handler(route, req);
  });
  return captured;
}

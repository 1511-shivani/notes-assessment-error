# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\ui\notes-crud.spec.ts >> A | UI - Notes CRUD (live) >> create, edit, delete a note with persistence checks
- Location: tests\ui\notes-crud.spec.ts:7:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /login/
Received string:  "https://practice.expandtesting.com/notes/app/register"
Timeout: 10000ms

Call log:
  - Expect "toHaveURL" with timeout 10000ms
    23 × locator resolved to <html lang="en">…</html>
       - unexpected value "https://practice.expandtesting.com/notes/app/register"

```

```yaml
- paragraph:
  - link "PMP Practice":
    - /url: https://pmp.expandtesting.com/
  - text: "| Free PMP Certification Mock Exam Test +900 Questions & Quizzes"
  - link "Try Dev Tools":
    - img
    - text: Try Dev Tools
- banner:
  - navigation "Main navigation":
    - link "SUT":
      - /url: /
      - 'img "Best Website for Practice Automation Testing: Free UI and REST API Examples and Apps. Using Cypress, Playwright, Selenium, WebdriverIO and Postman."'
      - text: Practice
    - list:
      - listitem:
        - button "Demos"
      - listitem:
        - link "Tools":
          - /url: /#tools
      - listitem:
        - link "Tips":
          - /url: /tips
      - listitem:
        - link "Test Cases":
          - /url: /test-cases
      - listitem:
        - link "API Testing":
          - /url: /notes/api/api-docs/
      - listitem:
        - link "About":
          - /url: /about
    - list
    - link "Free ISTQB Mock Exams":
      - /url: https://istqb.expandtesting.com/
- main:
  - paragraph:
    - text: Do you enjoy this platform? ❤️
    - link "Buy us a coffee":
      - /url: https://www.buymeacoffee.com/expandtesting
  - insertion:
    - heading "These are topics related to the article that might interest you" [level=2]: Discover more
    - link "Try Cloud Tools"
    - link "Try Dev Tools"
    - link "Learn to Code"
    - link "Source Robotics"
    - link "Audit Security"
    - link "Upgrade Tech"
    - link "Automation practice website"
    - link "Software Testing Resources"
  - navigation "breadcrumb mb-2":
    - list:
      - listitem:
        - link "Practice":
          - /url: /
      - listitem:
        - text: /
        - link "Home - My Notes - The App for Automation Testing Practice":
          - /url: /notes/app/
  - heading "Register" [level=1]
  - text: User account created successfully
  - separator
  - link "Click here to Log In":
    - /url: /notes/app/login
  - insertion:
    - heading "These are topics related to the article that might interest you" [level=2]: Discover more
    - link "Automation Testing Tools"
    - link "QA Training Courses"
    - link "WebdriverIO Tutorials"
    - link "API Testing Guide"
    - link "API Testing Tools"
    - link "Selenium Practice Labs"
    - link "Playwright Automation Examples"
    - link "Compare Broadband"
- contentinfo:
  - heading "Practice Test Automation WebSite for Web UI and Rest API" [level=4]
  - paragraph:
    - text: "Version: e64cd80e | Copyright"
    - link "Expand Testing":
      - /url: https://expandtesting.com/
    - text: "2026"
    - link "Try Dev Tools":
      - img
      - text: Try Dev Tools
- img
```

# Test source

```ts
  1  | import { test, expect } from '../../src/fixtures/base';
  2  | import { NotesApi } from '../../src/api/notesApi';
  3  | 
  4  | // Setup choice (documented): user is registered through the UI form, then logged in through the UI.
  5  | // Teardown deletes the account through the API so no test data lingers.
  6  | test.describe('A | UI - Notes CRUD (live)', () => {
  7  |   test('create, edit, delete a note with persistence checks', async ({ page, notesPage, api }) => {
  8  |     const user = NotesApi.uniqueUser('ui');
  9  |     const created = NotesApi.uniqueNote('UI note');
  10 |     const edited = NotesApi.uniqueNote('UI edited');
  11 | 
  12 |     await test.step('register a unique user via UI and log in', async () => {
  13 |       await notesPage.register(user);
> 14 |       await expect(page).toHaveURL(/login/);
     |                          ^ Error: expect(page).toHaveURL(expected) failed
  15 |       await notesPage.login(user);
  16 |     });
  17 | 
  18 |     try {
  19 |       await test.step('create note and verify it is listed', async () => {
  20 |         await notesPage.createNote(created.title, created.description);
  21 |         await notesPage.expectNote(created.title, created.description);
  22 |       });
  23 | 
  24 |       await test.step('edit note, reload, verify persistence', async () => {
  25 |         await notesPage.editNote(created.title, edited.title, edited.description);
  26 |         await notesPage.expectNote(edited.title, edited.description);
  27 |         await page.reload();
  28 |         await notesPage.expectNote(edited.title, edited.description);
  29 |         await notesPage.expectNoNote(created.title);
  30 |       });
  31 | 
  32 |       await test.step('delete note, verify absence, reload and confirm still absent', async () => {
  33 |         await notesPage.deleteNote(edited.title);
  34 |         await notesPage.expectNoNote(edited.title);
  35 |         await page.reload();
  36 |         await expect(notesPage.addNoteButton).toBeVisible(); // page loaded before asserting absence
  37 |         await notesPage.expectNoNote(edited.title);
  38 |       });
  39 |     } finally {
  40 |       const token = await api.login(user);
  41 |       await api.deleteAccount(token);
  42 |     }
  43 |   });
  44 | });
  45 | 
```
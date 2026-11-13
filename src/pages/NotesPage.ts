import { Page, Locator, expect } from '@playwright/test';
import { TestUser } from '../api/notesApi';

/** Page object for the Notes UI. Relative paths resolve under baseURL (trailing slash). */
export class NotesPage {
  constructor(readonly page: Page) {}

  // ---------- locators (stable data-testid / roles) ----------
  get loginEmail(): Locator { return this.page.getByTestId('login-email'); }
  get loginPassword(): Locator { return this.page.getByTestId('login-password'); }
  get loginSubmit(): Locator { return this.page.getByTestId('login-submit'); }
  get registerName(): Locator { return this.page.getByTestId('register-name'); }
  get registerEmail(): Locator { return this.page.getByTestId('register-email'); }
  get registerPassword(): Locator { return this.page.getByTestId('register-password'); }
  get registerConfirm(): Locator { return this.page.getByTestId('register-confirm-password'); }
  get registerSubmit(): Locator { return this.page.getByTestId('register-submit'); }
  get addNoteButton(): Locator { return this.page.getByTestId('add-new-note'); }
  get noteTitleInput(): Locator { return this.page.getByTestId('note-title'); }
  get noteDescriptionInput(): Locator { return this.page.getByTestId('note-description'); }
  get noteSubmit(): Locator { return this.page.getByTestId('note-submit'); }
  get logoutButton(): Locator { return this.page.getByTestId('logout'); }
  get alert(): Locator { return this.page.getByRole('alert'); }
  get cards(): Locator { return this.page.getByTestId('note-card'); }

  cardByTitle(title: string): Locator {
    return this.cards.filter({ has: this.page.getByTestId('note-card-title').filter({ hasText: title }) });
  }

  // ---------- navigation ----------
  async gotoLogin() { await this.page.goto('login'); }
  async gotoRegister() { await this.page.goto('register'); }
  async gotoHome() { await this.page.goto('./'); }

  // ---------- actions ----------
  async register(u: TestUser) {
    await this.gotoRegister();
    await this.registerEmail.fill(u.email);
    await this.registerName.fill(u.name);
    await this.registerPassword.fill(u.password);
    await this.registerConfirm.fill(u.password);
    await this.registerSubmit.click();
  }

  async login(u: TestUser) {
    await this.gotoLogin();
    await this.loginEmail.fill(u.email);
    await this.loginPassword.fill(u.password);
    await this.loginSubmit.click();
    await expect(this.addNoteButton).toBeVisible();
  }

  async createNote(title: string, description: string) {
    await this.addNoteButton.click();
    await this.noteTitleInput.fill(title);
    await this.noteDescriptionInput.fill(description);
    await this.noteSubmit.click();
  }

  async editNote(oldTitle: string, title: string, description: string) {
    await this.cardByTitle(oldTitle).getByTestId('note-edit').click();
    await this.noteTitleInput.fill(title);
    await this.noteDescriptionInput.fill(description);
    await this.noteSubmit.click();
  }

  async deleteNote(title: string) {
    await this.cardByTitle(title).getByTestId('note-delete').click();
    await this.page.getByTestId('note-delete-confirm').click();
  }

  async expectNote(title: string, description?: string) {
    const card = this.cardByTitle(title);
    await expect(card).toBeVisible();
    if (description) await expect(card.getByTestId('note-card-description')).toHaveText(description);
  }

  async expectNoNote(title: string) {
    await expect(this.cardByTitle(title)).toHaveCount(0);
  }
}

import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export interface TestUser {
  name: string;
  email: string;
  password: string;
  token?: string;
}

export interface NoteInput {
  title: string;
  description: string;
  category?: 'Home' | 'Work' | 'Personal';
}

/** Thin helper over the documented Notes API (https://practice.expandtesting.com/notes/api/api-docs/). */
export class NotesApi {
  constructor(private readonly request: APIRequestContext) {}

  static uniqueUser(prefix = 'qa'): TestUser {
    const id = `${Date.now()}${Math.floor(Math.random() * 1e6)}`;
    return { name: `${prefix} user ${id}`, email: `${prefix}.${id}@example.com`, password: 'Passw0rd!123' };
  }

  static uniqueNote(prefix = 'Note'): Required<NoteInput> {
    const id = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
    return { title: `${prefix} ${id}`, description: `Description for ${prefix} ${id}`, category: 'Home' };
  }

  private auth(token: string) {
    return { 'x-auth-token': token };
  }

  register(u: TestUser): Promise<APIResponse> {
    return this.request.post('users/register', {
      data: { name: u.name, email: u.email, password: u.password },
    });
  }

  async login(u: TestUser): Promise<string> {
    const res = await this.request.post('users/login', { data: { email: u.email, password: u.password } });
    expect(res.status(), 'login status').toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.token).toBeTruthy();
    return body.data.token as string;
  }

  /** Raw call without a token, used for the 401/403 negative test. */
  listNotesUnauthenticated(): Promise<APIResponse> {
    return this.request.get('notes');
  }

  createNote(token: string, n: NoteInput): Promise<APIResponse> {
    return this.request.post('notes', { headers: this.auth(token), data: { category: 'Home', ...n } });
  }

  listNotes(token: string): Promise<APIResponse> {
    return this.request.get('notes', { headers: this.auth(token) });
  }

  getNote(token: string, id: string): Promise<APIResponse> {
    return this.request.get(`notes/${id}`, { headers: this.auth(token) });
  }

  updateNote(token: string, id: string, n: NoteInput & { completed?: boolean }): Promise<APIResponse> {
    return this.request.put(`notes/${id}`, {
      headers: this.auth(token),
      data: { category: 'Home', completed: false, ...n },
    });
  }

  deleteNote(token: string, id: string): Promise<APIResponse> {
    return this.request.delete(`notes/${id}`, { headers: this.auth(token) });
  }

  deleteAccount(token: string): Promise<APIResponse> {
    return this.request.delete('users/delete-account', { headers: this.auth(token) });
  }

  /** Convenience: create and return the new note's data. */
  async createNoteOk(token: string, n: NoteInput) {
    const res = await this.createNote(token, n);
    expect(res.status(), 'create note status').toBe(200);
    const body = await res.json();
    return body.data as { id: string; title: string; description: string; category: string; completed: boolean };
  }
}

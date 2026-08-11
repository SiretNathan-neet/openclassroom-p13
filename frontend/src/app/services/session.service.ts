import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';

const STORAGE_KEY = 'ycyw-current-user';

@Injectable({ providedIn: 'root' })
export class SessionService {
  readonly currentUser = signal<User | null>(this.loadFromStorage());

  private loadFromStorage(): User | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as User : null;
  }

  selectUser(user: User): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.currentUser.set(null);
  }
}
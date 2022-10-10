import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINT } from 'utils/constants';
import { tap } from 'rxjs';
import { InvoiceService } from 'services/invoices/invoice.service';

export interface LoggedInUser {
  token: string;
  user: {
    id: string;
    username: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private store = localStorage;
  private KEY = 'user';
  constructor(
    private http: HttpClient,
    private invoiceService: InvoiceService
  ) {}

  login(username: string, password: string) {
    const url = `${API_ENDPOINT}/auth/login`;
    return this.http
      .post<LoggedInUser>(url, {
        username,
        password,
      })
      .pipe(
        tap((value) => {
          this.storeUser(value);
          this.invoiceService.switchTo('HTTP');
        })
      );
  }

  register(username: string, password: string) {
    const url = `${API_ENDPOINT}/auth/signup`;
    return this.http
      .post<LoggedInUser>(url, {
        username,
        password,
      })
      .pipe(
        tap((value) => {
          this.storeUser(value);
          this.invoiceService.switchTo('HTTP');
        })
      );
  }

  logout() {
    this.store.removeItem(this.KEY);
    this.invoiceService.switchTo('STORAGE');
  }

  get isLoggedIn(): boolean {
    return !!this.store.getItem(this.KEY);
  }

  get user(): LoggedInUser['user'] | undefined {
    return this.getStoredUser()?.user;
  }

  get token(): string | undefined {
    return this.getStoredUser()?.token;
  }

  private getStoredUser(): LoggedInUser | null {
    try {
      const stored = this.store.getItem(this.KEY);

      if (stored) {
        return JSON.parse(stored);
      }

      return null;
    } catch {
      return null;
    }
  }

  private storeUser(user: LoggedInUser) {
    this.store.setItem(this.KEY, JSON.stringify(user));
  }
}

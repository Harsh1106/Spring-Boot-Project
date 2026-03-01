import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of, catchError, map } from 'rxjs';

export interface User {
  customerId?: string;
  username: string;
  password?: string;
  role: 'customer' | 'officer';
  name: string;
  email: string;
  mobile: string;
  address: string;
  pincode?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'parcel_users';
  private readonly CURRENT_USER_KEY = 'current_user';
  private readonly API_URL = 'http://localhost:8081';

  constructor(private router: Router, private http: HttpClient) {}

  register(user: User): Observable<any> {
    const endpoint = user.role === 'officer' ? '/registerAdmin' : '/registerCustomer';
    return this.http.post<any>(`${this.API_URL}${endpoint}`, user).pipe(
      tap(response => {
        if (response.success && response.customerId) {
          user.customerId = response.customerId;
        }
      })
    );
  }

  login(userId: string, password: string): Observable<User | null> {
    return this.http.post<any>(`${this.API_URL}/validateLogin`, { userId, password }).pipe(
      map(response => {
        if (response.success) {
          const user: User = {
            username: response.username || userId,
            role: response.role.toLowerCase(), // Ensure consistent case
            name: response.name,
            email: response.email,
            mobile: response.mobile,
            address: response.address,
            pincode: response.pincode,
            customerId: response.customerId
          };
          sessionStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
          return user;
        }
        return null;
      }),
      catchError(error => {
        console.error('Login error', error);
        return of(null);
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem(this.CURRENT_USER_KEY);
    this.router.navigate(['/homepage']);
  }

  clearSession(): void {
    sessionStorage.removeItem(this.CURRENT_USER_KEY);
  }

  getCurrentUser(): User | null {
    const userStr = sessionStorage.getItem(this.CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  isCustomer(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'customer';
  }

  isOfficer(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'officer';
  }

  getAllCustomers(): User[] {
    // This was sync, but now should probably be async if fetched from backend.
    // However, since it's unused, I'll return empty array or implement async if needed.
    // Given the previous check said it's unused, I will leave it returning empty array
    // to avoid breaking build if something references it, but ideally it should be removed or updated.
    return [];
  }

  getCustomerById(customerId: string): User | null {
     // This was also sync. If needed, should be async.
     // For now returning null as we need to migrate callers to async if they use it.
     return null;
  }

  getCustomerByUsername(username: string): User | null {
    return null;
  }
}


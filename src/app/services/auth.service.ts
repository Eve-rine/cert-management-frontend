import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class AuthService {
  private jwtKey = 'jwt_token';
  // private api = 'http://localhost:8080/auth/login';
   private api = `${environment.apiUrl}/auth/login`;

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    const params = { username, password };
    return this.http.post<{
      accessToken: string;
      expiry: number;
      role: string;
      customerId?: string;
    }>(this.api, null, { params }).pipe(
      tap(res => {
        localStorage.setItem(this.jwtKey, res.accessToken);
        localStorage.setItem('user_role', res.role);
        if (res.customerId) localStorage.setItem('customer_id', res.customerId);
        localStorage.setItem('token_expiry', String(res.expiry)); // optional
      })
    );
  }

  isLoggedIn() {
    return !!localStorage.getItem(this.jwtKey);
  }

  logout() {
    localStorage.removeItem(this.jwtKey);
    localStorage.removeItem('user_role');
    localStorage.removeItem('customer_id');
    localStorage.removeItem('token_expiry');
  }

  getRole() {
    return localStorage.getItem('user_role');
  }
  getToken() {
    return localStorage.getItem(this.jwtKey);
  }
}
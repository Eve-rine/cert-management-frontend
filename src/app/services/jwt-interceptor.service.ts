import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Exempt login request
    if (req.url.match(/\/auth\/login$/)) {
      return next.handle(req);
    }

    // Add JWT if available
    let token: string | null = null;
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      token = localStorage.getItem('jwt_token');
    }

    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      console.debug('JWT Interceptor: Adding Bearer token', token);
    } else {
      console.warn('JWT Interceptor: Missing token, request is sent without Authorization header');
    }

    // Handle HTTP errors (401 & 403)
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          console.warn('Unauthorized or forbidden, redirecting to login...');
          
          localStorage.removeItem('jwt_token');

          // Redirect
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}

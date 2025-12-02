import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Exempt requests to /auth/login (case insensitive, works for absolute or relative URLs)
    if (req.url.match(/\/auth\/login$/)) {
      return next.handle(req);
    }

    let token: string | null = null;
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      token = localStorage.getItem('jwt_token');
    }
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.debug('JWT Interceptor: Adding Bearer token', token);
    } else {
      console.warn('JWT Interceptor: Missing token, request is sent without Authorization header');
    }
    return next.handle(req);
  }
}
import { JwtInterceptor } from './jwt-interceptor.service';
import { HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('JwtInterceptor', () => {
  let interceptor: JwtInterceptor;
  let routerSpy: jasmine.SpyObj<Router>;
  let httpHandler: jasmine.SpyObj<HttpHandler>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    interceptor = new JwtInterceptor(routerSpy);
    httpHandler = jasmine.createSpyObj('HttpHandler', ['handle']);
    spyOn(localStorage, 'getItem').and.callFake((key: string) =>
      key === 'jwt_token' ? 'testtoken' : null
    );
    spyOn(localStorage, 'removeItem').and.callThrough();
  });

  it('should add Authorization header if token exists (not on /auth/login)', () => {
    const req: any = { url: '/someapi', clone: jasmine.createSpy().and.callFake((opts: any) => ({ ...req, ...opts })) };
    httpHandler.handle.and.returnValue(of(new HttpResponse({ status: 200, body: {} })));
    interceptor.intercept(req as HttpRequest<any>, httpHandler).subscribe();
    expect(req.clone).toHaveBeenCalled();
  });

  it('should skip Authorization on /auth/login', () => {
    const req: any = { url: '/auth/login', clone: jasmine.createSpy() };
    httpHandler.handle.and.returnValue(of(new HttpResponse({ status: 200, body: {} })));
    interceptor.intercept(req as HttpRequest<any>, httpHandler).subscribe();
    expect(req.clone).not.toHaveBeenCalled();
  });

  it('should handle 401/403 errors and redirect', () => {
    const req: any = { url: '/someapi', clone: jasmine.createSpy() };
    httpHandler.handle.and.returnValue(throwError(() => new HttpErrorResponse({ status: 401 })));
    interceptor.intercept(req as HttpRequest<any>, httpHandler).subscribe({
      error: () => {
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
        expect(localStorage.removeItem).toHaveBeenCalledWith('jwt_token');
      }
    });
  });
});
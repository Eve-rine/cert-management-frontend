import { RoleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRouteSnapshot } from '@angular/router';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let mockAuth: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let route: ActivatedRouteSnapshot;

  beforeEach(() => {
    mockAuth = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'getRole']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    guard = new RoleGuard(mockAuth, mockRouter);
    route = new ActivatedRouteSnapshot();
  });

  it('should block navigation and redirect if not logged in', () => {
    mockAuth.isLoggedIn.and.returnValue(false);
    route.data = { expectedRole: 'ADMIN' };
    expect(guard.canActivate(route)).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should block navigation and redirect if logged in but wrong role', () => {
    mockAuth.isLoggedIn.and.returnValue(true);
    mockAuth.getRole.and.returnValue('USER');
    route.data = { expectedRole: 'ADMIN' };
    expect(guard.canActivate(route)).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should allow navigation if logged in with correct role', () => {
    mockAuth.isLoggedIn.and.returnValue(true);
    mockAuth.getRole.and.returnValue('ADMIN');
    route.data = { expectedRole: 'ADMIN' };
    expect(guard.canActivate(route)).toBeTrue();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should allow navigation if no expectedRole specified', () => {
    mockAuth.isLoggedIn.and.returnValue(true);
    mockAuth.getRole.and.returnValue('USER');
    route.data = {};
    expect(guard.canActivate(route)).toBeTrue();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
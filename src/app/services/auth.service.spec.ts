import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let store: any = {};

  // Mock localStorage
  beforeAll(() => {
    spyOn(localStorage, 'getItem').and.callFake((key: string) => store[key]);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => { store[key] = value; });
    spyOn(localStorage, 'removeItem').and.callFake((key: string) => { delete store[key]; });
  });

  beforeEach(() => {
    store = {};
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call login and store tokens', () => {
    const expected = { accessToken: 'abc', expiry: 123, role: 'USER', customerId: 'cid' };
    service.login('test', 'pass').subscribe(res => {
      expect(localStorage.setItem).toHaveBeenCalledWith('jwt_token', 'abc');
      expect(localStorage.setItem).toHaveBeenCalledWith('user_role', 'USER');
      expect(localStorage.setItem).toHaveBeenCalledWith('customer_id', 'cid');
      expect(localStorage.setItem).toHaveBeenCalledWith('token_expiry', '123');
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login?username=test&password=pass`);
    req.flush(expected);
  });

  it('should detect login state based on storage', () => {
    store['jwt_token'] = 'x';
    expect(service.isLoggedIn()).toBe(true);
    store['jwt_token'] = undefined;
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should remove items from storage on logout', () => {
    store['jwt_token'] = 'y';
    service.logout();
    expect(store['jwt_token']).toBeUndefined();
  });

  it('should get role and token from storage', () => {
    store['user_role'] = 'ADMIN';
    store['jwt_token'] = 'abc123';
    expect(service.getRole()).toBe('ADMIN');
    expect(service.getToken()).toBe('abc123');
  });
});
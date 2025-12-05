import { TestBed } from '@angular/core/testing';
import { UsersService, User } from './users.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService]
    });
    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get users', () => {
    service.getUsers().subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/api/users`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should create user', () => {
    const user: User = { username: 'x', role: 'USER' };
    service.createUser(user).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/api/users`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(user);
    req.flush({});
  });

  it('should update user', () => {
    const user: Partial<User> = { name: 'new' };
    service.updateUser('uid', user).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/api/users/uid`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(user);
    req.flush({});
  });

  it('should delete user', () => {
    service.deleteUser('uid').subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/api/users/uid`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
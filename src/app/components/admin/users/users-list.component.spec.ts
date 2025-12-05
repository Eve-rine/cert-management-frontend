import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersListComponent } from './users-list.component';
import { UsersService } from '../../../services/users.service';
import { CustomersService } from '../../../services/customers.service';
import { of, throwError } from 'rxjs';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  let mockUserService: jasmine.SpyObj<UsersService>;
  let mockCustomerService: jasmine.SpyObj<CustomersService>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UsersService', [
      'getUsers',
      'createUser',
      'updateUser',
      'deleteUser'
    ]);
    mockCustomerService = jasmine.createSpyObj('CustomersService', ['getCustomers']);

    await TestBed.configureTestingModule({
      imports: [UsersListComponent],
      providers: [
        { provide: UsersService, useValue: mockUserService },
        { provide: CustomersService, useValue: mockCustomerService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
  });

  it('should create users-list component', () => {
    expect(component).toBeTruthy();
  });

  it('should load users and customers on init', () => {
    mockUserService.getUsers.and.returnValue(of([]));
    mockCustomerService.getCustomers.and.returnValue(of([]));
    component.ngOnInit();
    expect(mockUserService.getUsers).toHaveBeenCalled();
    expect(mockCustomerService.getCustomers).toHaveBeenCalled();
  });

  it('should display error when loading users fails', () => {
    mockUserService.getUsers.and.returnValue(throwError(() => new Error()));
    component.loadUsers();
    expect(component.error).toBe('Failed to load users');
  });
});
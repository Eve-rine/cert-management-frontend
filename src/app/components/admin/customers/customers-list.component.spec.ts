import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomersListComponent } from './customers-list.component';
import { CustomersService } from '../../../services/customers.service';
import { of, throwError } from 'rxjs';

describe('CustomersListComponent', () => {
  let component: CustomersListComponent;
  let fixture: ComponentFixture<CustomersListComponent>;
  let mockService: jasmine.SpyObj<CustomersService>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('CustomersService', [
      'getCustomers',
      'createCustomer',
      'updateCustomer',
      'deleteCustomer'
    ]);

    await TestBed.configureTestingModule({
      imports: [CustomersListComponent],
      providers: [{ provide: CustomersService, useValue: mockService }]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomersListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load customers on init', () => {
    mockService.getCustomers.and.returnValue(of([]));
    component.ngOnInit();
    expect(mockService.getCustomers).toHaveBeenCalled();
  });

  it('should display error when customer service fails', () => {
    mockService.getCustomers.and.returnValue(throwError(() => new Error()));
    component.loadCustomers();
    expect(component.error).toBe('Failed to load customers');
  });
});
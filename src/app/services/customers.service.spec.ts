import { TestBed } from '@angular/core/testing';
import { CustomersService, Customer } from './customers.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

describe('CustomersService', () => {
  let service: CustomersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CustomersService]
    });
    service = TestBed.inject(CustomersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get customers', () => {
    service.getCustomers().subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/api/customers`);
    req.flush([]);
  });

  it('should create customer', () => {
    const customer: Customer = { name: 'X', email: 'x@email.com' };
    service.createCustomer(customer).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/api/customers`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(customer);
    req.flush({});
  });

  it('should update customer', () => {
    const customer: Customer = { name: 'Y', email: 'y@email.com' };
    service.updateCustomer('id', customer).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/api/customers/id`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(customer);
    req.flush({});
  });

  it('should delete customer', () => {
    service.deleteCustomer('cid').subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/api/customers/cid`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
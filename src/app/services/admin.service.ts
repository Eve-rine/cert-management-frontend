import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class AdminService {
  private api = '/admin';

  constructor(private http: HttpClient) {}

  createUser(data: {name: string, username: string, email: string, password: string, role: string, customerId?: string}) {
    return this.http.post(`${this.api}/users`, data);
  }

  createCustomer(data: {name: string, email: string}) {
    return this.http.post(`${this.api}/customers`, data);
  }
}
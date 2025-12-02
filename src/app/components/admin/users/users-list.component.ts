import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService, User } from '../../../services/users.service';
import { CustomersService, Customer } from '../../../services/customers.service';
declare var bootstrap: any;

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  imports: [CommonModule, FormsModule]
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  customers: Customer[] = []; // <--- Add this
  form: User = { name: '', username: '', password: '', role: 'USER', customerId: '' };
  success = '';
  error = '';

  constructor(
    private usersService: UsersService,
    private customersService: CustomersService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadCustomers();
  }

  loadUsers() {
    this.usersService.getUsers().subscribe({
      next: (users) => this.users = users,
      error: () => this.error = 'Failed to load users'
    });
  }

  loadCustomers() {
    this.customersService.getCustomers().subscribe({
      next: (customers) => this.customers = customers,
      error: () => {} // Suppress error during user add flow
    });
  }

  openModal() {
    const modalEl = document.getElementById('addUserModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  addUser() {
    if (!this.form.name || !this.form.username || !this.form.password || !this.form.role) {
      this.error = 'Please fill all required fields';
      this.success = '';
      return;
    }
    let userPayload = { ...this.form };
    if (userPayload.role !== 'USER') delete userPayload.customerId;
    this.usersService.createUser(userPayload).subscribe({
      next: () => {
        this.success = 'User added successfully!';
        this.error = '';
        this.loadUsers();
        this.form = { name: '', username: '', password: '', role: 'USER', customerId: '' };
        const modalEl = document.getElementById('addUserModal');
        if (modalEl) {
          const modal = bootstrap.Modal.getInstance(modalEl);
          if (modal) modal.hide();
        }
        setTimeout(() => this.success = '', 2000);
      },
      error: () => {
        this.error = 'Failed to create user';
        this.success = '';
      }
    });
  }
}
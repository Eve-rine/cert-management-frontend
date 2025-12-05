import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService, User } from '../../../services/users.service';
import { CustomersService, Customer } from '../../../services/customers.service';
declare var bootstrap: any;

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
  imports: [CommonModule, FormsModule]
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  customers: Customer[] = [];
  form: User = { name: '', username: '', password: '', role: 'USER', customerId: '' };
  editingUser: User | null = null;
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
      error: () => {}
    });
  }

  openModal(user?: User) {
    if (user) {
      this.editingUser = user;
      this.form = {
        name: user.name || '',
        username: user.username,
        password: '', 
        role: user.role,
        customerId: user.customerId || ''
      };
    } else {
      this.editingUser = null;
      this.form = { name: '', username: '', password: '', role: 'USER', customerId: '' };
    }
    
    const modalEl = document.getElementById('addUserModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  saveUser() {
    if (!this.form.name || !this.form.username) {
      this.error = 'Please fill all required fields';
      this.success = '';
      return;
    }

    // Password is required only when creating new user
    if (!this.editingUser && !this.form.password) {
      this.error = 'Password is required for new users';
      this.success = '';
      return;
    }

    console.log("editingUser:", this.editingUser);
    let userPayload: any = { ...this.form };
    
    // Remove customerId if role is not USER
    if (userPayload.role !== 'USER') {
      delete userPayload.customerId;
    }

    // Don't send empty password on update
    if (this.editingUser && !userPayload.password) {
      delete userPayload.password;
    }

    if (this.editingUser?.id) {
      this.usersService.updateUser(this.editingUser.id, userPayload).subscribe({
        next: () => {
          this.success = 'User updated successfully!';
          this.error = '';
          this.loadUsers();
          this.closeModal();
          setTimeout(() => this.success = '', 2000);
        },
        error: () => {
          this.error = 'Failed to update user';
          this.success = '';
        }
      });
    } else {
      this.usersService.createUser(userPayload).subscribe({
        next: () => {
          this.success = 'User added successfully!';
          this.error = '';
          this.loadUsers();
          this.closeModal();
          setTimeout(() => this.success = '', 2000);
        },
        error: () => {
          this.error = 'Failed to create user';
          this.success = '';
        }
      });
    }
  }

  deleteUser(user: User) {
    if (!user.id) return;
    
    if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
      this.usersService.deleteUser(user.id).subscribe({
        next: () => {
          this.success = 'User deleted successfully!';
          this.error = '';
          this.loadUsers();
          setTimeout(() => this.success = '', 2000);
        },
        error: () => {
          this.error = 'Failed to delete user';
          this.success = '';
        }
      });
    }
  }

  closeModal() {
    this.form = { name: '', username: '', password: '', role: 'USER', customerId: '' };
    this.editingUser = null;
    const modalEl = document.getElementById('addUserModal');
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
  }
}
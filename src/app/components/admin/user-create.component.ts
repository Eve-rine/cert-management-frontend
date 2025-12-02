import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-create',
  imports: [CommonModule, FormsModule],
  templateUrl: 'user-create.component.html'
})
export class UserCreateComponent {
  form = { name: '', username: '', email: '', password: '', role: 'USER', customerId: '' };
  success = '';
  error = '';

  constructor(private admin: AdminService) {}

  submit() {
    this.admin.createUser(this.form).subscribe({
      next: () => this.success = 'User created!',
      error: err => this.error = 'Failed to create user'
    });
  }
}
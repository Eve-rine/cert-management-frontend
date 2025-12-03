import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  imports: [CommonModule, FormsModule],
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        // const role = this.auth.getRole();
        // if (role === 'ADMIN') this.router.navigate(['/admin']);
        // else this.router.navigate(['/certificates']);
        this.router.navigate(['/dashboard']);
      },
      error: err => this.error = 'Invalid credentials'
    });
  }
}
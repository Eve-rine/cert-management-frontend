import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule],
  // templateUrl: './app.html',
  templateUrl: './layouts/app-layout.component.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('cert-management-frontend');

  userRole: string = '';

  constructor(public router: Router) {}

    get isLoginPage(): boolean {
    return this.router.url === '/login';
    // Or: return this.router.url.startsWith('/login');
  }

  ngOnInit() {
    // Load current role from storage (adjust key as needed)
    this.userRole = localStorage.getItem('user_role') || '';
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

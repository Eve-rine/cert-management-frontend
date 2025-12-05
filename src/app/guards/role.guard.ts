import { Injectable } from '@angular/core';
import { CanActivate, Router,ActivatedRouteSnapshot  } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({providedIn: 'root'})
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    const expectedRole = route.data['expectedRole'];
    const actualRole = this.auth.getRole();
    if (expectedRole && actualRole !== expectedRole) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
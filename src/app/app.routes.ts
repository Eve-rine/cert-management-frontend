import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CustomersListComponent } from './components/admin/customers-list.component';
import { UsersListComponent } from './components/admin/users-list.component';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
      { path: 'login', component: LoginComponent },
      { path: 'customers', component: CustomersListComponent},
      {path: '', redirectTo: 'login', pathMatch: 'full' },
      {path:'users',component:UsersListComponent},
//   { path: 'admin', component: AdminHomeComponent, canActivate: [RoleGuard] },
];

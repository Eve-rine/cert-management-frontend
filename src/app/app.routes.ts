import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CustomersListComponent } from './components/admin/customers/customers-list.component';
import { UsersListComponent } from './components/admin/users/users-list.component';
import { RoleGuard } from './guards/role.guard';
import { TemplateUploadComponent } from './components/user/template-upload/template-upload.component';
import { GenerateCertificateComponent } from './components/user/certificates/generate-certificate.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TemplateListComponent } from './components/user/template-list/template-list.component';

export const routes: Routes = [
      { path: 'login', component: LoginComponent },
  // ADMIN routes
  { path: 'customers', component: CustomersListComponent, canActivate: [RoleGuard], data: { expectedRole: 'ADMIN' } },
  { path: 'users', component: UsersListComponent, canActivate: [RoleGuard], data: { expectedRole: 'ADMIN' } },

  // USER routes
  { path: 'templates', component: TemplateListComponent, canActivate: [RoleGuard], data: { expectedRole: 'USER' } },
  { path: 'template-upload', component: TemplateUploadComponent, canActivate: [RoleGuard], data: { expectedRole: 'USER' } },
  { path: 'generate-certificate', component: GenerateCertificateComponent, canActivate: [RoleGuard], data: { expectedRole: 'USER' } },

  // Others
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }

];

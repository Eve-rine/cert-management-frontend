import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CustomersListComponent } from './components/admin/customers/customers-list.component';
import { UsersListComponent } from './components/admin/users/users-list.component';
import { RoleGuard } from './guards/role.guard';
import { TemplateUploadComponent } from './components/user/templates/template-upload.component';
import { GenerateCertificateComponent } from './components/user/certificates/generate-certificate.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
      { path: 'login', component: LoginComponent },
      { path: 'customers', component: CustomersListComponent},
      {path: '', redirectTo: 'login', pathMatch: 'full' },
      {path:'users',component:UsersListComponent},
      {path:'template-upload',component:TemplateUploadComponent},
      {path: 'certificate-generation', component: GenerateCertificateComponent },
      {path:'dashboard',component: DashboardComponent},

//   { path: 'admin', component: AdminHomeComponent, canActivate: [RoleGuard] },
];

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TemplateDto } from '../components/user/templates/template-upload.component';

@Injectable({providedIn: 'root'})
export class TemplateService {
  private api = '/admin';

  constructor(private http: HttpClient) {}

 getTemplates() {
  return this.http.get<TemplateDto[]>(`${environment.apiUrl}/api/templates`);
}

 getTemplate(id: string) {
  return this.http.get<TemplateDto>(`${environment.apiUrl}/api/templates/${id}`);
}

// template.service.ts
updateTemplate(id: string, name: string, htmlContent: string, logoFile?: File, signatureFile?: File) {
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const htmlFile = new File([blob], 'template.html', { type: 'text/html' });
  const formData = new FormData();
  formData.append('name', name);
  formData.append('file', htmlFile);
  if (logoFile) formData.append('logo', logoFile, logoFile.name);
  if (signatureFile) formData.append('signature', signatureFile, signatureFile.name);
  return this.http.put(`${environment.apiUrl}/api/templates/${id}`, formData);
}

}
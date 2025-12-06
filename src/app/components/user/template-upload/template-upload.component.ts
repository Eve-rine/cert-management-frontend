import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QuillModule } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { environment } from '../../../../environments/environment';

export interface TemplateDto {
  id: string;
  name: string;
  logoUrl?: string;
  signatureUrl?: string;
  createdAt: string;
  html: string;
}


@Component({
  selector: 'app-template-upload',
  templateUrl: './template-upload.component.html',
  styleUrls: ['./template-upload.component.css'],
  imports: [QuillModule, FormsModule, CommonModule]
})
export class TemplateUploadComponent {
  templateName = '';
  htmlContent = '';
  uploadSuccess = false;

  // Images
  logoFile?: File;
  logoPreview?: string;
  signatureFile?: File;
  signaturePreview?: string;

  // Optionally handle customerId if multi-tenant
  customerId: string = ''; // Set from user context
  templates: TemplateDto[] = [];
  previewTemplate?: TemplateDto;

  editorModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      // ['link', 'image'],
      ['clean']
    ]
  };

  certificatePlaceholder: string = 'Create your certificate template. Use {{student_name}}, {{course_name}}, etc. as placeholders.';

  constructor(private http: HttpClient) {}

  // Image preview logic
  onLogoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.logoFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => this.logoPreview = e.target.result;
      reader.readAsDataURL(this.logoFile);
    }
  }

  onSignatureSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.signatureFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => this.signaturePreview = e.target.result;
      reader.readAsDataURL(this.signatureFile);
    }
  }

  downloadAsFile() {
    const blob = new Blob([this.htmlContent], { type: 'text/html' });
    const a = document.createElement('a');
    a.download = 'template.html';
    a.href = URL.createObjectURL(blob);
    a.click();
    URL.revokeObjectURL(a.href);
  }

  uploadTemplate() {
    if (!this.templateName || !this.htmlContent) {
      alert('Template name and certificate content are required');
      return;
    }
    const blob = new Blob([this.htmlContent], { type: 'text/html' });
    const htmlFile = new File([blob], 'template.html', { type: 'text/html' });

    const formData = new FormData();
    formData.append('name', this.templateName);      // template name
    formData.append('file', htmlFile);               // html content
    if (this.logoFile) formData.append('logo', this.logoFile, this.logoFile.name);
    if (this.signatureFile) formData.append('signature', this.signatureFile, this.signatureFile.name);
    if (this.customerId) formData.append('customerId', this.customerId);

    this.http.post(`${environment.apiUrl}/api/templates/upload`, formData)
      .subscribe({
        next: _ => this.uploadSuccess = true,
        error: _ => this.uploadSuccess = false
      });
  }

  
  ngOnInit() {
    this.http.get<TemplateDto[]>(`${environment.apiUrl}/api/templates`)
      .subscribe(ts => this.templates = ts);
  }

  preview(t: TemplateDto) {
    this.previewTemplate = t;
  }
}
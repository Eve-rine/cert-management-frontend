import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QuillModule } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 


@Component({
  selector: 'app-template-upload',
  templateUrl: './template-upload.component.html',
  styleUrls: ['./template-upload.component.css'],
  imports: [QuillModule, FormsModule, CommonModule]

})
export class TemplateUploadComponent {
  htmlContent = '';
  uploadSuccess = false;
  editorModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  constructor(private http: HttpClient) {}

  certificatePlaceholder: string = 'Create your certificate template. Use {{student_name}}, {{course_name}}, etc. as placeholders.';

  downloadAsFile() {
    const blob = new Blob([this.htmlContent], { type: 'text/html' });
    const a = document.createElement('a');
    a.download = 'template.html';
    a.href = URL.createObjectURL(blob);
    a.click();
    URL.revokeObjectURL(a.href);
  }

  uploadTemplate() {
    const blob = new Blob([this.htmlContent], { type: 'text/html' });
    const file = new File([blob], 'template.html', { type: 'text/html' });
    const formData = new FormData();
    formData.append('file', file);

    this.http.post('http://localhost:8080/api/templates/upload', formData)
      .subscribe({
        next: _ => this.uploadSuccess = true,
        error: _ => this.uploadSuccess = false
      });
  }
}
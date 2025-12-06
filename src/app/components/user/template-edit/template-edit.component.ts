import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { TemplateService } from '../../../services/template.service';

@Component({
  selector: 'app-template-edit',
  templateUrl: './template-edit.component.html',
  styleUrls: ['./template-edit.component.css'],
    imports: [CommonModule, FormsModule, QuillModule]
})
export class TemplateEditComponent implements OnInit {
  id: string = '';
  name: string = '';
  htmlContent: string = '';
  logoFile?: File;
  logoPreview?: string;
  signatureFile?: File;
  signaturePreview?: string;
  uploadSuccess = false;

  constructor(private route: ActivatedRoute, private templateService: TemplateService) {}

  
  editorModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    //   ['link', 'image'],
      ['clean']
    ]
  };

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.templateService.getTemplate(this.id).subscribe(t => {
      this.name = t.name;
      this.htmlContent = t.html;
      this.logoPreview = t.logoUrl ?? '';
      this.signaturePreview = t.signatureUrl ?? '';
    });
  }

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

  submitEdit() {
    this.templateService.updateTemplate(this.id, this.name, this.htmlContent, this.logoFile, this.signatureFile)
      .subscribe({
        next: _ => this.uploadSuccess = true,
        error: _ => this.uploadSuccess = false
      });
  }
}
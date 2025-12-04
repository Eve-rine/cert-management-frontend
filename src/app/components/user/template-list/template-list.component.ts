import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { DatePipe, CommonModule } from '@angular/common';

export interface TemplateDto {
  id: string;
  name: string;
  logoUrl?: string;
  signatureUrl?: string;
  createdAt: string;
  html: string;
}

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
    styleUrls: ['./template-list.component.css'],
  imports: [DatePipe, CommonModule],
  standalone: true
})
export class TemplateListComponent implements OnInit {
  templates: TemplateDto[] = [];
  previewTemplate?: TemplateDto;

  constructor(private http: HttpClient,
      private router: Router
  ) {}

  ngOnInit() {
    this.http.get<TemplateDto[]>(`${environment.apiUrl}/api/templates`)
      .subscribe(ts => this.templates = ts);
  }

  preview(t: TemplateDto) {
    this.previewTemplate = t;
  }



  openAddTemplate() {
    // window.location.href = '/template-upload';
      this.router.navigate(['/template-upload']);

    }

goToGenerate(templateId: string) {
//   window.location.href = `/generate-certificate?templateId=${templateId}`;
  this.router.navigate(['/generate-certificate'], { queryParams: { templateId } });

}

delete(templateId: string) {
    if (!confirm('Are you sure you want to delete this template?')) {
        return;
    }

    this.http.delete(`${environment.apiUrl}/api/templates/${templateId}`)
        .subscribe({
            next: () => {
                this.templates = this.templates.filter(t => t.id !== templateId);
            },
            error: () => {
                alert('Failed to delete template.');
            }
        });
    }
}
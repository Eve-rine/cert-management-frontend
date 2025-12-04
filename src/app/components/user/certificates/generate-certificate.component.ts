import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { CertificateService } from '../../../services/certificate.service';

@Component({
  selector: 'app-generate-certificate',
  standalone: true,
  templateUrl: './generate-certificate.component.html',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  styleUrls: ['./generate-certificate.component.css']
})
export class GenerateCertificateComponent implements OnInit {
  schema: any;
  form!: FormGroup;
  loading = false;
  generatedId: string | null = null;
  error: string | null = null;

  constructor(
    private certService: CertificateService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}


  ngOnInit() {
    this.loading = true;
    this.loading = true;

  // Get templateId from query params
  const templateId = this.route.snapshot.queryParamMap.get('templateId');
  if (!templateId) {
    this.error = 'No template selected';
    this.loading = false;
    return;
  }

  // Fetch schema for selected template
  this.certService.getSchema(templateId).subscribe({
    next: (schema) => {
      this.schema = schema;
      this.buildForm(schema);
      this.loading = false;
    },
    error: () => {
      this.error = 'Failed to fetch certificate schema.';
      this.loading = false;
    }
  });
  }

  buildForm(schema: any) {
    const controls: Record<string, any> = {};
    for (const key of Object.keys(schema.properties)) {
      controls[key] = [
        '', 
        schema.required && schema.required.includes(key) ? Validators.required : []
      ];
    }
    this.form = this.fb.group(controls);
  }


  onSubmit() {
  if (this.form.invalid) { this.form.markAllAsTouched(); return; }
  const dataObj = this.form.value;
  const dataJson = JSON.stringify(dataObj);

  const templateId = this.route.snapshot.queryParamMap.get('templateId');
  if (!templateId) {
    this.error = 'No template selected';
    return;
  }

  this.certService.generateCertificate(templateId, dataJson).subscribe({
    next: res => {
      this.generatedId = res.id;
      this.error = null;
    },
    error: _ => {
      this.error = 'Failed to generate certificate.';
      this.generatedId = null;
    }
  });
}


  downloadPdf() {
    if (!this.generatedId) return;
    this.certService.downloadCertificatePdf(this.generatedId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
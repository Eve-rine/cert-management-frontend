import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CertificateService {
  private baseUrl = `${environment.apiUrl}/api/certificates`;

  constructor(private http: HttpClient) {}

    getSchema(templateId: string) {
     return this.http.get(`${environment.apiUrl}/api/certificates/schema`, {
    params: { templateId }  
  });
    }

  generateCertificate(templateId: string, dataJson: string) {
  return this.http.post<{id: string}>(`${environment.apiUrl}/api/certificates/generate`, {
    templateId,
    dataJson
  });
}

  downloadCertificatePdf(id: string) {
    return this.http.get(`${this.baseUrl}/${id}/pdf`, { responseType: 'blob' });
  }
}
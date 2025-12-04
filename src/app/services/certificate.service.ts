import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CertificateService {
  private baseUrl = `${environment.apiUrl}/api/certificates`;

  constructor(private http: HttpClient) {}

//   getSchema() {
//     return this.http.get<any>(`${this.baseUrl}/schema`);
//   }
    getSchema(templateId: string) {
    // return this.http.get<any>(`${environment.apiUrl}/api/templates/schema?templateId=${templateId}`);
     return this.http.get(`${environment.apiUrl}/api/certificates/schema`, {
    params: { templateId }  // <-- must match @RequestParam("templateId")
  });
    }

//   generateCertificate(data: any) {
//     const res = this.http.post<{ id: string }>(`${this.baseUrl}/generate`, data);
//     console.log("Certificate generation response:", res);
//     return res;
//   }

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
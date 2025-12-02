import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CertificateService {
  private baseUrl = `${environment.apiUrl}/api/certificates`;

  constructor(private http: HttpClient) {}

  getSchema() {
    return this.http.get<any>(`${this.baseUrl}/schema`);
  }

  generateCertificate(data: any) {
    const res = this.http.post<{ id: string }>(`${this.baseUrl}/generate`, data);
    console.log("Certificate generation response:", res);
    return res;
  }

  downloadCertificatePdf(id: string) {
    return this.http.get(`${this.baseUrl}/${id}/pdf`, { responseType: 'blob' });
  }
}
import { TestBed } from '@angular/core/testing';
import { CertificateService } from './certificate.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

describe('CertificateService', () => {
  let service: CertificateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CertificateService]
    });
    service = TestBed.inject(CertificateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get schema', () => {
    service.getSchema('tid').subscribe();
    const req = httpMock.expectOne(r => r.url === `${environment.apiUrl}/api/certificates/schema` && r.params.get('templateId') === 'tid');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should generate certificate', () => {
    service.generateCertificate('tid', '{"name":"x"}').subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/api/certificates/generate`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ templateId: 'tid', dataJson: '{"name":"x"}' });
    req.flush({id: 'cid'});
  });

  it('should download certificate PDF', () => {
    service.downloadCertificatePdf('someid').subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/api/certificates/someid/pdf`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    req.flush(new Blob());
  });
});
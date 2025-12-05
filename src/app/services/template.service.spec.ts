import { TestBed } from '@angular/core/testing';
import { TemplateService } from './template.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

describe('TemplateService', () => {
  let service: TemplateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TemplateService]
    });
    service = TestBed.inject(TemplateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get templates', () => {
    service.getTemplates().subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/api/templates`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should get template by id', () => {
    service.getTemplate('tid').subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/api/templates/tid`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should update a template', () => {
    service.updateTemplate('tid', 'templateName', '<html></html>').subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/api/templates/tid`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });
});
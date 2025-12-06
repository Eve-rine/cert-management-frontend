import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenerateCertificateComponent } from './generate-certificate.component';
import { CertificateService } from '../../../services/certificate.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('GenerateCertificateComponent', () => {
  let component: GenerateCertificateComponent;
  let fixture: ComponentFixture<GenerateCertificateComponent>;
  let mockCertService: jasmine.SpyObj<CertificateService>;
  let mockRoute: any;

  beforeEach(async () => {
    mockCertService = jasmine.createSpyObj('CertificateService', ['getSchema', 'generateCertificate', 'downloadCertificatePdf']);
    mockRoute = {
      snapshot: { queryParamMap: { get: (param: string) => '123' } }
    };

    await TestBed.configureTestingModule({
      imports: [GenerateCertificateComponent],
      providers: [
        { provide: CertificateService, useValue: mockCertService },
        { provide: FormBuilder, useValue: new FormBuilder() },
        { provide: ActivatedRoute, useValue: mockRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GenerateCertificateComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display error if schema fetch fails', () => {
    mockCertService.getSchema.and.returnValue(throwError(() => new Error()));
    component.ngOnInit();
    expect(component.error).toContain('Failed to fetch');
  });

  it('should call certService.getSchema on init', () => {
    mockCertService.getSchema.and.returnValue(of({ properties: {}, required: [] }));
    spyOn(component, 'buildForm');
    component.ngOnInit();
    expect(mockCertService.getSchema).toHaveBeenCalledWith('123');
    expect(component.buildForm).toHaveBeenCalled();
  });
});
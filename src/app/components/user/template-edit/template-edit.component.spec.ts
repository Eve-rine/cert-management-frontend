import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateEditComponent } from './template-edit.component';
import { ActivatedRoute } from '@angular/router';
import { TemplateService } from '../../../services/template.service';
import { of } from 'rxjs';

describe('TemplateEditComponent', () => {
  let component: TemplateEditComponent;
  let fixture: ComponentFixture<TemplateEditComponent>;
  let mockRoute: any;
  let mockTemplateService: jasmine.SpyObj<TemplateService>;

  beforeEach(async () => {
    mockRoute = {
      snapshot: { paramMap: { get: () => 'abc' } }
    };
    mockTemplateService = jasmine.createSpyObj('TemplateService', ['getTemplate', 'updateTemplate']);

    await TestBed.configureTestingModule({
      imports: [TemplateEditComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: TemplateService, useValue: mockTemplateService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateEditComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

it('should load template on init', () => {
  const response = {
    id: '1',
    name: 'MyTemplate',
    html: '<p></p>',
    logoUrl: 'logo.png',
    signatureUrl: 'sign.png',
    createdAt: '2024-01-01'
  };
  mockTemplateService.getTemplate.and.returnValue(of(response));
  component.ngOnInit();
  expect(component.name).toBe('MyTemplate');
  expect(component.htmlContent).toBe('<p></p>');
  expect(component.logoPreview).toBe('logo.png');
  expect(component.signaturePreview).toBe('sign.png');
});

  it('should set uploadSuccess=true on submitEdit success', () => {
    mockTemplateService.updateTemplate.and.returnValue(of({}));
    component.id = 'abc'; component.name = 'Test'; component.htmlContent = '<h1>test</h1>';
    component.submitEdit();
    expect(component.uploadSuccess).toBeTrue();
  });
});
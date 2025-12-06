import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateListComponent } from './template-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('TemplateListComponent', () => {
  let component: TemplateListComponent;
  let fixture: ComponentFixture<TemplateListComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TemplateListComponent],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load templates on init', () => {
    spyOn(component['http'], 'get').and.returnValue(of([{ id: '1', name: 'Template' }]));
    component.ngOnInit();
    expect(component.templates.length).toBeGreaterThan(0);
  });

  it('should set previewTemplate', () => {
    const t = { id: '1', name: 'Document', html: '<p>x</p>', createdAt: '', logoUrl: '', signatureUrl: '' };
    component.preview(t);
    expect(component.previewTemplate).toBe(t);
  });

  it('should delete template after confirm', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component['http'], 'delete').and.returnValue(of({}));
    component.templates = [{ id: 'a', name: 'a', createdAt: '', html: '' }];
    component.delete('a');
    expect(component.templates.length).toBe(0);
  });
});
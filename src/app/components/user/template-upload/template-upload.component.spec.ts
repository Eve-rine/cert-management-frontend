import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateUploadComponent } from './template-upload.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TemplateUploadComponent', () => {
  let component: TemplateUploadComponent;
  let fixture: ComponentFixture<TemplateUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateUploadComponent, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateUploadComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle logo file selection', () => {
    const file = new File(['x'], 'logo.png', { type: 'image/png' });
    const event = { target: { files: [file] } } as unknown as Event;
    component.onLogoSelected(event);
    expect(component.logoFile).toBe(file);
  });

  it('should handle missing templateName or htmlContent on upload', () => {
    spyOn(window, 'alert');
    component.templateName = '';
    component.htmlContent = '';
    component.uploadTemplate();
    expect(window.alert).toHaveBeenCalled();
  });
});
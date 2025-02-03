import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailComposerComponent } from './email-composer.component';

describe('EmailComposerComponent', () => {
  let component: EmailComposerComponent;
  let fixture: ComponentFixture<EmailComposerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailComposerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailComposerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

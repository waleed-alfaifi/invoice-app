import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceStatusComponent } from './invoice-status.component';

describe('InvoiceStatusComponent', () => {
  let component: InvoiceStatusComponent;
  let fixture: ComponentFixture<InvoiceStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

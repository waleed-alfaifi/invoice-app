import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesListHeaderComponent } from './invoices-list-header.component';

describe('InvoicesListHeaderComponent', () => {
  let component: InvoicesListHeaderComponent;
  let fixture: ComponentFixture<InvoicesListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicesListHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicesListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

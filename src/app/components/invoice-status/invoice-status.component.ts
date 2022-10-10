import { Component, Input } from '@angular/core';
import { Invoice } from 'services/invoices/invoice.service';

@Component({
  selector: 'app-invoice-status',
  templateUrl: './invoice-status.component.html',
  styleUrls: ['./invoice-status.component.css'],
})
export class InvoiceStatusComponent {
  @Input() status!: Invoice['status'] | undefined;
}

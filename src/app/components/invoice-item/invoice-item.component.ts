import { Component, Input, OnInit } from '@angular/core';
import { Invoice } from 'services/invoices/invoice.service';

@Component({
  selector: 'app-invoice-item',
  templateUrl: './invoice-item.component.html',
  styleUrls: ['./invoice-item.component.css'],
})
export class InvoiceItemComponent implements OnInit {
  @Input() invoice!: Invoice;
  total = 0;

  constructor() {}

  ngOnInit(): void {
    if (this.invoice) {
      this.total =
        this.invoice.items?.reduce(
          (prev, acc) => prev + acc.price * acc.quantity,
          0
        ) ?? 0;
    }
  }

  get dueDate() {
    const { date, payment } = this.invoice;
    const map = {
      terms_1: 1,
      terms_7: 7,
      terms_14: 14,
      terms_30: 30,
    } as const;

    const oneDay = 1000 * 60 * 60 * 24;
    let dueDate = date;

    if (payment?.key && typeof date === 'number') {
      dueDate += oneDay * map[payment.key];
    }

    return dueDate;
  }
}

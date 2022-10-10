import { Component, Input, OnInit } from '@angular/core';
import { Invoice } from 'services/invoices/invoice.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css'],
})
export class InvoiceListComponent implements OnInit {
  @Input() isLoading!: boolean;
  @Input('invoices') invoices!: Invoice[];

  constructor() {}

  ngOnInit(): void {}
}

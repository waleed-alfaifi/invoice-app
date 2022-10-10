import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getRoutePath } from 'app-routing.module';
import { Invoice, InvoiceService } from 'services/invoices/invoice.service';
import { NotificationService } from 'services/notifications/notification.service';

@Component({
  selector: 'app-new-invoice',
  templateUrl: './new-invoice.component.html',
  styleUrls: ['./new-invoice.component.css'],
})
export class NewInvoiceComponent implements OnInit {
  constructor(
    private service: InvoiceService,
    private notify: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  newInvoice(invoice: Omit<Invoice, 'id'>) {
    this.notify.loading('Adding new invoice...');

    this.service.add(invoice).subscribe((addedInvoice) => {
      const detailPage = getRoutePath('invoiceDetails', addedInvoice.id);
      const displayedId = addedInvoice.id.substring(0, 7).toUpperCase();

      setTimeout(() => {
        this.router.navigateByUrl(detailPage, {
          replaceUrl: true,
        });
      }, 2000);

      if (addedInvoice.status === 'Draft') {
        return this.notify.simple(
          `Invoice with id ${displayedId} is saved as draft.`
        );
      }

      this.notify.simple(`Invoice with id ${displayedId} is saved and sent.`);
    });
  }

  redirectToHome() {
    this.router.navigateByUrl('/');
  }
}

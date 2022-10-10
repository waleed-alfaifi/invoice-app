import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getRoutePath } from 'app-routing.module';
import { Invoice, InvoiceService } from 'services/invoices/invoice.service';
import { NotificationService } from 'services/notifications/notification.service';

@Component({
  selector: 'app-invoice-edit',
  templateUrl: './invoice-edit.component.html',
  styleUrls: ['./invoice-edit.component.css'],
})
export class InvoiceEditComponent implements OnInit {
  id!: string | null;
  invoice: Invoice | undefined;
  get invoiceDisplayId() {
    return this.id?.substring(0, 7).toUpperCase();
  }

  constructor(
    private route: ActivatedRoute,
    private service: InvoiceService,
    private router: Router,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('invoiceId');
    });

    this.service.findOne(this.id).subscribe((value) => {
      this.invoice = value;
    });
  }

  onEdit(invoice: Omit<Invoice, 'id'>) {
    const invoiceId = this.invoice?.id;

    if (invoiceId) {
      this.notify.loading('Saving changes...');

      this.service
        .update({
          id: invoiceId,
          ...invoice,
        })
        .subscribe(() => {
          this.notify.simple(`Changes to ${this.invoiceDisplayId} saved.`);

          setTimeout(
            () =>
              this.id &&
              this.router.navigateByUrl(
                getRoutePath('invoiceDetails', this.id)
              ),
            1000
          );
        });
    }
  }

  redirectToDetails() {
    if (this.id)
      this.router.navigateByUrl(getRoutePath('invoiceDetails', this.id));
  }
}

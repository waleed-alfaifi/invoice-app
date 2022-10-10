import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Invoice, InvoiceService } from 'services/invoices/invoice.service';
import { getRoutePath } from 'app-routing.module';
import { NotificationService } from 'services/notifications/notification.service';
import { DialogService } from 'services/dialogs/dialog.service';
import { Location } from '@angular/common';
import { NavigationService } from 'services/navigation/navigation.service';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.css'],
})
export class InvoiceDetailsComponent implements OnInit {
  id!: string | null;
  invoice: Invoice | undefined;
  grandTotal: number | undefined;
  isLoading = false;
  get invoiceDisplayId() {
    return this.invoice?.id.substring(0, 7).toUpperCase();
  }

  constructor(
    private route: ActivatedRoute,
    private service: InvoiceService,
    private router: Router,
    private dialog: DialogService,
    private notify: NotificationService,
    public navigate: NavigationService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('invoiceId');
    });

    this.service.findOne(this.id).subscribe((value) => {
      this.isLoading = false;

      this.invoice = value;
      this.grandTotal = value?.items?.reduce(
        (prev, acc) => prev + acc.price * acc.quantity,
        0
      );
    });
  }

  get dueDate() {
    if (this.invoice) {
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

    return null;
  }

  editInvoice() {
    if (this.id) {
      this.router.navigateByUrl(getRoutePath('editInvoice', this.id));
    }
  }

  markPaid() {
    if (this.invoice?.status === 'Paid') return;

    this.service
      .update({
        id: this.id as string,
        status: 'Paid',
      })
      .subscribe((updated) => {
        if (updated) {
          this.invoice = updated;
          this.notify.simple(`Marked invoice ${this.invoiceDisplayId} as Paid`);
        }
      });
  }

  openDeleteConfirm(template: TemplateRef<{}>) {
    this.dialog.open(template);
  }

  closeDeleteConfirm() {
    this.dialog.close();
  }

  deleteInvoice(id: string | undefined) {
    this.dialog.close();
    this.notify.loading('Deleting invoice...');

    if (id) {
      this.service.delete(id).subscribe((didDelete) => {
        if (didDelete) {
          this.notify.simple(
            `Invoice #${this.invoiceDisplayId} was deleted successfully`
          );

          setTimeout(() => {
            this.router.navigateByUrl('/');
          }, 1000);
        } else {
          this.notify.simple('Error: invoice was not deleted');
        }
      });
    }
  }
}

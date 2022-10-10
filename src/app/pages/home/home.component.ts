import { Component } from '@angular/core';
import { Invoice, InvoiceService } from 'services/invoices/invoice.service';
import { UiService } from 'services/ui/ui.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  private _unfiltered: Invoice[] = [];
  isLoading = false;
  invoices: Invoice[] = [];

  constructor(invoiceService: InvoiceService, uiService: UiService) {
    this.isLoading = true;
    invoiceService.list().subscribe((value) => {
      this.isLoading = false;
      this.invoices = value;
      this._unfiltered = value;
    });

    uiService.onChange().subscribe(this.onFilterChange);
  }

  private onFilterChange = (values: string[]) => {
    // Okay, so here we're supposed to update our local version of invoices to match those of status selected by the user

    if (values.length === 0) {
      this.invoices = this._unfiltered;
      return;
    }

    this.invoices = this._unfiltered.filter((invoice) => {
      const valuesString = values.join(' ');
      return valuesString.includes(invoice.status.toLowerCase());
    });
  };
}

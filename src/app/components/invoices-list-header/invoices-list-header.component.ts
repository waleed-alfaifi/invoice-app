import { Component, Input, OnInit } from '@angular/core';
import { DropdownOption } from 'components/dropdown/dropdown.component';
import { UiService } from 'services/ui/ui.service';

@Component({
  selector: 'app-invoices-list-header',
  templateUrl: './invoices-list-header.component.html',
  styleUrls: ['./invoices-list-header.component.css'],
})
export class InvoicesListHeaderComponent implements OnInit {
  @Input('invoiceCount') numberOfInvoices!: number;
  filters: DropdownOption[] = [
    {
      name: 'Draft',
      value: 'draft',
    },
    {
      name: 'Pending',
      value: 'pending',
    },
    {
      name: 'Paid',
      value: 'paid',
    },
  ];
  isFiltersOpen = false;

  constructor(public uiService: UiService) {
    this.notifyService(uiService.selected);
  }

  ngOnInit(): void {}

  toggleFilters() {
    this.isFiltersOpen = !this.isFiltersOpen;
  }

  notifyService(selectedValues: string[]) {
    this.uiService.changeSelected(selectedValues);
  }
}

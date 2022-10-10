import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'pages/home/home.component';
import { InvoiceEditComponent } from 'pages/invoice-edit/invoice-edit.component';
import { NewInvoiceComponent } from 'pages/new-invoice/new-invoice.component';
import { InvoiceDetailsComponent } from './pages/invoice-details/invoice-details.component';

const paths = {
  invoiceDetails: 'invoice/:invoiceId',
  editInvoice: 'invoice/:invoiceId/edit',
  newInvoice: 'new',
} as const;

export const getRoutePath = (page: keyof typeof paths, param: string) => {
  const path = paths[page];
  return path.replace(/:(\w)+/, param);
};

const routes: Routes = [
  {
    path: paths['newInvoice'],
    component: NewInvoiceComponent,
  },
  {
    path: paths['invoiceDetails'],
    component: InvoiceDetailsComponent,
  },
  {
    path: paths['editInvoice'],
    component: InvoiceEditComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

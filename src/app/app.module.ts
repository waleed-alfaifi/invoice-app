import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InvoiceItemComponent } from './components/invoice-item/invoice-item.component';
import { HeaderComponent } from './components/header/header.component';
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component';
import { InvoicesListHeaderComponent } from './components/invoices-list-header/invoices-list-header.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { InvoiceDetailsComponent } from './pages/invoice-details/invoice-details.component';
import { HomeComponent } from './pages/home/home.component';
import { InvoiceStatusComponent } from './components/invoice-status/invoice-status.component';
import { InvoiceEditComponent } from './pages/invoice-edit/invoice-edit.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewInvoiceComponent } from './pages/new-invoice/new-invoice.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvoiceFormComponent } from './components/invoice-form/invoice-form.component';
import { httpInterceptors } from 'http-interceptors';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { BackComponent } from './components/back/back.component';
import { InputDirective } from './directives/input.directive';

@NgModule({
  declarations: [
    AppComponent,
    InvoiceItemComponent,
    HeaderComponent,
    InvoiceListComponent,
    InvoicesListHeaderComponent,
    DropdownComponent,
    InvoiceDetailsComponent,
    HomeComponent,
    InvoiceStatusComponent,
    InvoiceEditComponent,
    NewInvoiceComponent,
    InvoiceFormComponent,
    AuthFormComponent,
    BackComponent,
    InputDirective,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatSliderModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [httpInterceptors],
  bootstrap: [AppComponent],
})
export class AppModule {}

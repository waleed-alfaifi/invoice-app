import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_ENDPOINT } from 'utils/constants';
import { Invoice, ServiceAdapter } from '../invoice.service';

@Injectable({
  providedIn: 'root',
})
export class HTTPAdapter implements ServiceAdapter {
  constructor(private http: HttpClient) {}

  list(): Observable<Invoice[]> {
    const url = `${API_ENDPOINT}/invoices`;
    return this.http.get<Invoice[]>(url);
  }

  findOne(id: string | null): Observable<Invoice | undefined> {
    const url = `${API_ENDPOINT}/invoices/${id}`;
    return this.http.get<Invoice>(url);
  }

  add(invoice: Omit<Invoice, 'id'>): Observable<Invoice> {
    const url = `${API_ENDPOINT}/invoices`;
    const invoiceBody = {
      ...invoice,
      payment: invoice.payment?.key,
    };

    return this.http.post<Invoice>(url, invoiceBody);
  }

  // On success, should update this invoice in cache
  delete(id: string): Observable<boolean> {
    const url = `${API_ENDPOINT}/invoices/${id}`;
    return this.http
      .delete<{ status: boolean }>(url)
      .pipe(map((value) => value.status));
  }

  // On success, should update this invoice in cache
  updateOne(
    invoice: Pick<Invoice, 'id'> & Partial<Invoice>
  ): Observable<Invoice | null> {
    const url = `${API_ENDPOINT}/invoices/${invoice.id}`;

    return this.http.put<Invoice>(url, {
      ...invoice,
      payment: invoice.payment?.key,
    });
  }
}

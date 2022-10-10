import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import ShortUniqueId from 'short-unique-id';
import { Invoice, ServiceAdapter } from '../invoice.service';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageAdapter implements ServiceAdapter {
  private store = localStorage;
  private KEY = 'INVOICES';
  private uid = new ShortUniqueId({
    dictionary: 'alphanum_upper',
    length: 7,
  });

  constructor() {}

  init(data: any) {
    const exists = this.getStored();
    if (!exists) this.persist(data);
  }

  list(): Observable<Invoice[]> {
    return of(this._list());
  }

  findOne(id: string | null): Observable<Invoice | undefined> {
    const invoices = this._list();
    return of(invoices.find((invoice) => invoice.id === id));
  }

  add(invoice: Omit<Invoice, 'id'>): Observable<Invoice> {
    const invoices = this._list();
    const uniqueId = this.uid();

    const newInvoice = {
      id: uniqueId,
      ...invoice,
    };

    const newInvoices = [newInvoice, ...invoices];
    this.persist(newInvoices);
    return of(newInvoice);
  }

  updateOne(
    invoice: Pick<Invoice, 'id'> & Partial<Invoice>
  ): Observable<Invoice | null> {
    const invoices = this._list();
    const updatedIndex = invoices.findIndex((i) => i.id === invoice.id);
    if (updatedIndex === -1) return of(null);

    const merged = {
      ...invoices[updatedIndex],
      ...invoice,
    };

    const newInvoices = [...invoices];
    newInvoices[updatedIndex] = merged;
    this.persist(newInvoices);

    return of(merged);
  }

  delete(id: string): Observable<boolean> {
    const invoices = this._list();
    const found = invoices.find((i) => i.id === id);

    if (!found) return of(false);

    const filtered = invoices.filter((i) => i.id !== id);
    this.persist(filtered);

    return of(true);
  }

  private _list(): Invoice[] {
    const item = this.store.getItem(this.KEY);

    if (item) {
      try {
        const parsed = JSON.parse(item);
        return parsed;
      } catch {
        return [];
      }
    }

    return [];
  }

  persist(data: unknown) {
    this.store.setItem(this.KEY, JSON.stringify(data));
  }

  getStored() {
    return this.store.getItem(this.KEY);
  }
}

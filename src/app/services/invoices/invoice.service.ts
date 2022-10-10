import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { CacheService } from 'services/cache/cache.service';
import { HTTPAdapter } from './adapters/HTTPAdapter';
import { LocalStorageAdapter } from './adapters/LocalStorageAdapter';

export interface Links
  extends Array<{
    rel: 'self' | 'item';
    href: string;
    action: 'GET' | 'POST' | 'PUT' | 'DELETE';
  }> {}

export interface Address {
  street: string;
  city: string;
  post_code: string;
  country: string;
}

export interface InvoiceItem {
  id?: number;
  name: string;
  quantity: number;
  price: number;
}

export type PaymentKey = 'terms_1' | 'terms_7' | 'terms_14' | 'terms_30';

export interface InvoiceDetails {
  description: string;
  address: Address;
  items: InvoiceItem[];
  payment: {
    key: PaymentKey;
    text: string;
  };
  links?: Links;
}

export interface Invoice extends Partial<InvoiceDetails> {
  id: string;
  client: {
    name: string;
    email?: string;
    address?: Address;
  };
  date: number;
  status: 'Paid' | 'Pending' | 'Draft';
}

interface IInvoiceService {
  list(): Observable<Invoice[]>;
  findOne(id: string): Observable<Invoice | undefined>;
  update(
    invoice: Pick<Invoice, 'id'> & Partial<Invoice>
  ): Observable<Invoice | null>;
  add(invoice: Omit<Invoice, 'id'>): Observable<Invoice>;
}

export interface ServiceAdapter {
  list(): Observable<Invoice[]>;
  findOne(id: string | null): Observable<Invoice | undefined>;
  add(invoice: Invoice): Observable<Invoice>;
  delete?(id: string): Observable<boolean>;
  updateOne(
    invoice: Pick<Invoice, 'id'> & Partial<Invoice>
  ): Observable<Invoice | null>;
}

type DataSource = 'STORAGE' | 'HTTP';

const LIST_CACHE_KEY = 'INVOICES_DATA';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService implements IInvoiceService {
  private _dataSource: DataSource = 'STORAGE';
  private readonly adapters = {
    STORAGE: this.localAdapter,
    HTTP: this.httpAdapter,
  };
  private readonly adapter = this.adapters[this.dataSource];
  private get _cachedList() {
    return this.cache.getValue<Invoice[]>(LIST_CACHE_KEY);
  }

  constructor(
    private localAdapter: LocalStorageAdapter,
    private httpAdapter: HTTPAdapter,
    private cache: CacheService
  ) {}

  get dataSource(): DataSource {
    let source = localStorage.getItem('DATA_SOURCE');

    if (!source || (source && !['STORAGE', 'HTTP'].includes(source))) {
      source = 'STORAGE';
    }

    this._dataSource = source as DataSource;
    return this._dataSource;
  }

  set dataSource(value) {
    this._dataSource = value;
  }

  switchTo(source: DataSource) {
    this.dataSource = source;
    localStorage.setItem('DATA_SOURCE', source);
  }

  list(): Observable<Invoice[]> {
    const { _cachedList, adapter } = this;
    if (_cachedList) return of(_cachedList);

    return adapter
      .list()
      .pipe(
        tap((value) => this.cache.setValue<Invoice[]>(LIST_CACHE_KEY, value))
      );
  }

  findOne(id: string | null): Observable<Invoice | undefined> {
    const cachedInvoice = this.cache.getValue<Invoice>(id);
    if (cachedInvoice) return of(cachedInvoice);

    return this.adapter.findOne(id).pipe(
      tap((value) => {
        if (value) {
          this.cache.setValue<Invoice>(value?.id, value);
        }
      })
    );
  }

  add(invoice: Omit<Invoice, 'id'>): Observable<Invoice> {
    return this.adapter.add(invoice).pipe(
      tap((value) => {
        const invoicesData = this._cachedList;

        if (invoicesData) {
          invoicesData.push(value);
        }

        this.cache.setValue<Invoice>(value.id, value);
      })
    );
  }

  update(
    invoice: Pick<Invoice, 'id'> & Partial<Invoice>
  ): Observable<Invoice | null> {
    return this.adapter.updateOne(invoice).pipe(
      tap((value) => {
        if (value) {
          this.cache.setValue(value?.id, value);
        }

        if (this._cachedList) {
          this.cache.setValue<Invoice[]>(
            LIST_CACHE_KEY,
            this._cachedList.map((i) => {
              if (i.id === value?.id) {
                return {
                  ...value,
                };
              }

              return i;
            })
          );
        }
      })
    );
  }

  delete(invoiceId: string) {
    if (this._cachedList) {
      this.cache.setValue<Invoice[]>(
        LIST_CACHE_KEY,
        this._cachedList.filter((i) => i.id !== invoiceId)
      );
    }

    return this.adapter.delete(invoiceId);
  }
}

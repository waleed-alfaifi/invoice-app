import { formatDate } from '@angular/common';
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Invoice, PaymentKey } from 'services/invoices/invoice.service';

const paymentTerms = {
  terms_1: 'Net 1 Day',
  terms_7: 'Net 7 Days',
  terms_14: 'Net 14 Days',
  terms_30: 'Net 30 Days',
} as const;

interface IFormValues {
  sender: {
    street: string;
    city: string;
    postCode: string;
    country: string;
  };
  client: {
    name: string;
    email: string;
    street: string;
    city: string;
    postCode: string;
    country: string;
  };
  meta: {
    date: string;
    terms: PaymentKey;
    description: string;
  };
}

interface FormItem {
  id: string | number;
  name: string;
  quantity: number;
  price: number;
}

type SubmittedItem = Omit<FormItem, 'id'> & { id?: number };

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.css'],
})
export class InvoiceFormComponent {
  private _initialData: Invoice | undefined;
  @Output('submittedInvoice') submit = new EventEmitter<Omit<Invoice, 'id'>>();
  @Output() cancel = new EventEmitter<void>();
  @Input('initialData') set initial(value: Invoice | undefined) {
    this._initialData = value;
    this.populateInitialData();
  }
  get initial(): Invoice | undefined {
    return this._initialData;
  }

  form = this.fb.group({
    sender: this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      postCode: ['', Validators.required],
      country: ['', Validators.required],
    }),
    client: this.fb.group({
      name: ['', Validators.required],
      email: new FormControl('', [Validators.required, Validators.email]),
      street: ['', Validators.required],
      city: ['', Validators.required],
      postCode: ['', Validators.required],
      country: ['', Validators.required],
    }),
    meta: this.fb.group({
      date: ['', Validators.required],
      terms: ['', Validators.required],
      description: ['', Validators.required],
    }),
  });
  private itemsCounter = 1;
  items: FormItem[] = [
    {
      id: 'Item1',
      name: '',
      price: 0,
      quantity: 0,
    },
  ];
  terms = Object.entries(paymentTerms);
  disableForm = false;

  constructor(private fb: FormBuilder) {}

  private populateInitialData() {
    if (this.initial) {
      const { address: sender, client, ...meta } = this.initial;
      const currentValues = this.form.value;
      const initialValues: Partial<IFormValues> = {};

      if (sender) {
        const { street, city, post_code, country } = sender;
        initialValues.sender = {
          street,
          city,
          country,
          postCode: post_code,
        };
      }

      if (client) {
        const { address, name, email } = client;
        const { street, city, post_code, country } = address || {};

        initialValues.client = {
          name: name,
          email: email ?? '',
          city: city ?? '',
          country: country ?? '',
          postCode: post_code ?? '',
          street: street ?? '',
        };
      }

      const { date, description, payment, items } = meta;
      const { key: terms } = payment || {};

      initialValues.meta = {
        date: formatDate(date, 'yyyy-MM-dd', 'en'),
        description: description ?? '',
        terms: terms ?? 'terms_14',
      };

      this.form.setValue({
        ...currentValues,
        ...initialValues,
      });

      if (items) {
        this.populateItems(items);
      }
    }
  }

  private populateItems(items: Omit<FormItem, 'id'>[]) {
    this.items = items.map((item) => {
      return {
        id: `Item${++this.itemsCounter}`,
        ...item,
      };
    });
  }

  addNewItem() {
    this.items.push({
      id: `Item${++this.itemsCounter}`,
      name: '',
      price: 0,
      quantity: 0,
    });
  }

  deleteItem(id: FormItem['id']) {
    const index = this.items.findIndex((i) => i.id === id);

    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  onSubmit() {
    const invoice = this.validateAndCreateInvoice();
    if (invoice) this.submit.emit(invoice);
  }

  saveAsDraft() {
    const invoice = this.validateAndCreateInvoice();
    if (invoice) {
      invoice.status = 'Draft';
      this.submit.emit(invoice);
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  get isEditMode() {
    return !!this.initial;
  }

  private validateItems() {
    const filtered = this.items
      .filter((item) => item.name.trim() && item.quantity > 0 && item.price > 0)
      .map((item) => {
        const { id, ...itemWithoutId } = item;

        if (typeof id === 'string') {
          return itemWithoutId;
        }

        return item;
      });

    if (filtered.length > 0) {
      return filtered as SubmittedItem[];
    }

    return false;
  }

  private validateAndCreateInvoice(): Omit<Invoice, 'id'> | null {
    const formValues: IFormValues = this.form.value;
    if (!this.form.valid) return null;

    this.disableForm = true;

    const { sender, client, meta } = formValues;

    const invoice: Omit<Invoice, 'id'> = {
      date: new Date(meta.date).getTime(),
      address: {
        city: sender.city,
        country: sender.country,
        post_code: sender.postCode,
        street: sender.street,
      },
      client: {
        name: client.name,
        email: client.email,
        address: {
          city: client.city,
          country: client.country,
          post_code: client.postCode,
          street: client.street,
        },
      },
      status: this.initial?.status || 'Pending',
      description: meta.description,
      payment: {
        key: meta.terms,
        text: paymentTerms[meta.terms],
      },
      items: this.validateItems() || [],
    };

    return invoice;
  }
}

import { Injectable } from '@angular/core';
import { LocalStorageAdapter } from 'services/invoices/adapters/LocalStorageAdapter';
import { Invoice } from 'services/invoices/invoice.service';
import { NotificationService } from 'services/notifications/notification.service';

@Injectable({
  providedIn: 'root',
})
export class FakerService {
  constructor(
    private localAdapter: LocalStorageAdapter,
    private notify: NotificationService
  ) {}

  generate() {
    const existingData = this.localAdapter.getStored();

    if (!existingData || (existingData && confirm('Override existing data?'))) {
      return import('./data.json').then((module) => {
        const data = module.default as Invoice[];
        this.localAdapter.persist(data);
        this.notify.simple('Created demo data');
        return true;
      });
    }

    return null;
  }
}

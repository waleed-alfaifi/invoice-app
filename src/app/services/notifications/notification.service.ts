import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private config: MatSnackBarConfig = {
    duration: 3000,
  };

  constructor(private snackbar: MatSnackBar) {}

  simple(message: string) {
    this.snackbar.open(message, 'Okay', this.config);
  }

  loading(message: string) {
    return this.snackbar.open(message);
  }
}

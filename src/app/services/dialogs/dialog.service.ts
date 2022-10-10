import { Injectable, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialogRef: MatDialogRef<{}, any> | undefined;

  constructor(private dialog: MatDialog) {}

  open(template: TemplateRef<{}>) {
    this.dialogRef = this.dialog.open(template, {
      width: '350px',
      panelClass: 'custom-dialog-container',
    });
  }

  close() {
    this.dialogRef?.close();
  }
}

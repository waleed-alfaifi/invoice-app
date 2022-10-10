import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'services/auth/auth.service';
import { NotificationService } from 'services/notifications/notification.service';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.css'],
})
export class AuthFormComponent implements OnInit {
  @Output('finished') authEmitter = new EventEmitter<unknown>();
  private _count = 0; // naive mechanism to handle submitting too many requests
  username = '';
  password = '';
  errorMessage: string | undefined = '';
  disableForm = false;

  constructor(private auth: AuthService, private notify: NotificationService) {}

  ngOnInit(): void {}

  onSubmit() {
    if (++this._count > 10) {
      this.disableForm = true;
      return;
    }

    this.disableForm = true;
    const { username, password } = this;

    this.auth.login(username, password).subscribe({
      next: (value) => {
        this.errorMessage = '';
        this.notify.simple(
          `Logged in successfully as ${value.user.username}. Reloading page...`
        );

        setTimeout(() => {
          location.reload();
        }, 1500);
      },
      error: (httpError) => {
        this.disableForm = false;

        if (httpError) {
          const { error } = httpError;
          this.errorMessage = error?.error;
        }
      },
    });
  }

  signup() {
    if (++this._count > 10) {
      this.disableForm = true;
      return;
    }

    this.disableForm = true;

    const { username, password } = this;
    this.auth.register(username, password).subscribe({
      next: (value) => {
        this.errorMessage = '';
        this.authEmitter.emit();
        this.notify.simple(
          `Signed up successfully as ${value.user.username}. Reloading page...`
        );

        setTimeout(() => {
          location.reload();
        }, 1500);
      },
      error: (httpError) => {
        this.disableForm = false;

        if (httpError) {
          const { error } = httpError;
          this.errorMessage = error?.error;
        }
      },
    });
  }
}

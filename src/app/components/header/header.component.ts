import { Component, OnInit } from '@angular/core';
import { AuthService } from 'services/auth/auth.service';
import { DialogService } from 'services/dialogs/dialog.service';
import { FakerService } from 'services/faker/faker.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(
    public dialog: DialogService,
    public auth: AuthService,
    public faker: FakerService
  ) {
    localStorage.theme = localStorage.theme || 'light';
    this.classToggler();
  }

  async generateDemoData() {
    const status = await this.faker.generate();

    if (status) {
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
  }

  get theme() {
    return localStorage.theme;
  }

  set theme(value: string) {
    value === 'light'
      ? (localStorage.theme = 'dark')
      : (localStorage.theme = 'light');
  }

  private classToggler() {
    if (localStorage.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleTheme() {
    this.theme = localStorage.theme;
    this.classToggler();
  }

  ngOnInit(): void {}

  logout() {
    this.auth.logout();
    this.dialog.close();
    location.reload();
  }
}

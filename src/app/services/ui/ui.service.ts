import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private subject = new Subject<string[]>();
  selected: string[] = [];

  constructor() {}

  onChange() {
    return this.subject.asObservable();
  }

  changeSelected(selected: string[]) {
    this.selected = selected;
    this.subject.next(this.selected);
  }
}

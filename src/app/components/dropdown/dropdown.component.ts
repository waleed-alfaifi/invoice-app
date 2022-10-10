import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface DropdownOption {
  name: string;
  value: string;
}

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
})
export class DropdownComponent implements OnInit {
  @Input('options') list: DropdownOption[] = [];
  @Input() initialSelected!: string[];
  @Output('getValues') changeEmitter = new EventEmitter<string[]>();
  selectedValues = new Set<string>();

  constructor() {}

  ngOnInit(): void {
    if (this.initialSelected) {
      this.selectedValues = new Set(this.initialSelected);
    }
  }

  changeEvent(e: Event, value: string) {
    if (e.target) {
      const isChecked = (e.target as HTMLInputElement).checked;

      if (isChecked) this.selectedValues.add(value);
      else this.selectedValues.delete(value);

      this.notifyParent();
    }
  }

  private notifyParent() {
    this.changeEmitter.emit([...this.selectedValues]);
  }
}

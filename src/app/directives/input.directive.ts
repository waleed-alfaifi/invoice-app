import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appInput]',
})
export class InputDirective {
  constructor(private el: ElementRef<HTMLElement | null>) {
    this.addClasses();
  }

  addClasses() {
    const { nativeElement } = this.el;
    if (nativeElement) {
      nativeElement.className +=
        ' px-2 py-2 text-xs bg-white border border-solid rounded-md shadow-sm text-md border-color-1 focus:outline-primary-light dark:bg-secondary dark:border-transparent dark:text-white';
    }
  }
}

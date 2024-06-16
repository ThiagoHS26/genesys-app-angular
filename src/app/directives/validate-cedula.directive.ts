import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appValidateCedula]'
})
export class ValidateCedulaDirective {

  constructor(private el: ElementRef, private control: NgControl) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const input = this.el.nativeElement.value;
    const isValid = this.validateCedula(input);
    this.control.control!.setErrors(isValid ? null : { 'cedulaInvalid': true });
  }

  validateCedula(cedula: string): boolean {
    if (cedula.length !== 10) {
      return false;
    }
    const digits = cedula.split('').map(Number);
    const province = parseInt(cedula.substring(0, 2), 10);
    if (province < 1 || province > 24) {
      return false;
    }
    const lastDigit = digits.pop();
    const sum = digits.reduce((acc, digit, index) => {
      let value = digit * (index % 2 === 0 ? 2 : 1);
      if (value > 9) value -= 9;
      return acc + value;
    }, 0);
    const verifier = 10 - (sum % 10);
    return verifier === lastDigit;
  }
}

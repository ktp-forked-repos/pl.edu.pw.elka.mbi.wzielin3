import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appSequenceInput]',
})
export class SequenceInputDirective {
  private allowedCharacters: string[] = ['A', 'C', 'G', 'T'];
  constructor(private el: ElementRef) { }

  /**
   * When key is pressed check if given key code is accepted.
   * @param event keyboard event
   */
  @HostListener('keydown', ['$event']) onKeyDown(event) {
    const e = <KeyboardEvent> event;
    if (this.isPrintable(e.keyCode)) {
      const symbol = e.key.toUpperCase();
      if (!this.isAllowed(symbol)) {
        e.preventDefault();
      }
    }
  }

  /**
   * After input to text box uppercase it's value.
   * Also caret position is forced to stay on the same position.
   * @param event keyboard event
   */
  @HostListener('input', ['$event']) onInput(event) {
    const e = <KeyboardEvent> event;
    const caretPos = this.el.nativeElement.selectionStart;
    this.el.nativeElement['value'] = this.el.nativeElement['value'].toUpperCase();
    setTimeout(() => {
      this.el.nativeElement.selectionStart = caretPos;
      this.el.nativeElement.selectionEnd = caretPos;
    });
  }

  isAllowed(text: string): boolean {
    text = text.toUpperCase();
    for (let i = 0; i < text.length; ++i) {
      if (this.allowedCharacters.indexOf(text[i]) < 0) {
        return false;
      }
    }
    return true;
  }

  /**
   * Check if given keycode is a printable character.
   * @param {number} keyCode key code to check
   * @returns {boolean} true if it is printable, false otherwise.
   */
  isPrintable(keyCode: number): boolean {
    return (keyCode > 47 && keyCode < 58)   || // number keys
      keyCode === 32 || keyCode === 13   || // spacebar & return key(s) (if you want to allow carriage returns)
      (keyCode > 64 && keyCode < 91)   || // letter keys
      (keyCode > 95 && keyCode < 112)  || // numpad keys
      (keyCode > 185 && keyCode < 193) || // ;=,-./` (in order)
      (keyCode > 218 && keyCode < 223);   // [\]' (in order)
  }
}

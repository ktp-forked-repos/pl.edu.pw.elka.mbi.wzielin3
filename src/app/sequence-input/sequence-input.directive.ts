import { Directive, ElementRef, HostListener } from '@angular/core';

/**
 * Directive used as a sequence input.
 * Performs basic validation.
 * For example allows only ACGT symbols to by inputed.
 */
@Directive({
  selector: '[appSequenceInput]',
})
export class SequenceInputDirective {
  constructor(private el: ElementRef) { }

  /**
   * When key is pressed checks if given key code is acceptable.
   * If key code is not acceptable prevents input.
   * @param event keyboard event
   */
  @HostListener('keydown', ['$event']) onKeyDown(event) {
    const e = <KeyboardEvent> event;
    if (this.isPrintable(e.keyCode) && !this.isAllowed(e.key.toUpperCase())) {
        e.preventDefault();
    }
  }

  /**
   * After input to text box make it's value uppercase.
   * Also caret position is forced to stay on the same position.
   * @param event keyboard event
   */
  @HostListener('input', ['$event']) onInput(event) {
    const caretPos = this.el.nativeElement.selectionStart;
    let oldValue = this.el.nativeElement['value'];
    let newValue = this.el.nativeElement['value'].toUpperCase();
     // remove in loop all characters different than A, C, G, T
    do {
      oldValue = newValue;
      newValue = newValue.replace(new RegExp('[^ACGT]+'), '');
    } while (newValue.length < oldValue.length);
    this.el.nativeElement['value'] = newValue;
    setTimeout(() => {
      this.el.nativeElement.selectionStart = caretPos;
      this.el.nativeElement.selectionEnd = caretPos;
    });
  }

  /**
   * Check if given text is allowed as a DNA sequence.
   * @param {string} text Text to be checked
   * @returns {boolean} true if value is acceptable, false otherwise.
   */
  isAllowed(text: string): boolean {
    return text.match(new RegExp('[^ACGT]+')) == null;
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

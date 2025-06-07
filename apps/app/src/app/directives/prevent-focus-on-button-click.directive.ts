import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
    selector: '[preventFocusOnButtonClick]'
})
export class PreventFocusOnButtonClickDirective implements AfterViewInit {
    constructor(private el: ElementRef) {}

    ngAfterViewInit() {
        const input = this.el.nativeElement.querySelector('input');
        const buttons = this.el.nativeElement.querySelectorAll('button');

        buttons.forEach(button => {
            button.addEventListener('mousedown', (event: MouseEvent) => {
                // Prevent the input from gaining focus
                event.preventDefault();
                input?.blur(); // Optional: explicitly remove focus if it was focused
            });
        });
    }
}

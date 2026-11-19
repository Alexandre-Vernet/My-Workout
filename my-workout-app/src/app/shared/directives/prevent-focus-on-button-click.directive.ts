import { Directive, ElementRef, AfterViewInit, inject } from '@angular/core';

@Directive({
    selector: '[appPreventFocusOnButtonClick]'
})
export class PreventFocusOnButtonClickDirective implements AfterViewInit {
    private readonly el = inject(ElementRef);


    ngAfterViewInit() {
        const input = this.el.nativeElement.querySelector('input');
        const buttons = this.el.nativeElement.querySelectorAll('button');

        buttons.forEach((button: HTMLButtonElement) => {
            button.addEventListener('mousedown', (event: MouseEvent) => {
                // Prevent the input from gaining focus
                event.preventDefault();
                input?.blur(); // Optional: explicitly remove focus if it was focused
            });
        });
    }
}

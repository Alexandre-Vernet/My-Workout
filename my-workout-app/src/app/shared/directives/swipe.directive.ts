import { Directive, ElementRef, inject, input, output } from '@angular/core';

@Directive({
    selector: '[appSwipe]'
})
export class SwipeDirective {

    threshold = input(50);
    // CSS selector for a descendant that should not trigger a swipe (e.g. a child with its own scroll/swipe).
    excludeSelector = input<string | null>(null);

    swipeLeft = output<void>();
    swipeRight = output<void>();

    private readonly elementRef = inject(ElementRef<HTMLElement>);

    private startX = 0;
    private endX = 0;

    constructor() {
        const element = this.elementRef.nativeElement as HTMLElement;

        element.addEventListener('touchstart', (event: TouchEvent) => {
            this.startX = event.changedTouches[0].screenX;
        });

        element.addEventListener('touchend', (event: TouchEvent) => {
            this.endX = event.changedTouches[0].screenX;
            this.handleSwipe(event);
        });
    }

    private handleSwipe(event: TouchEvent) {
        const excludeSelector = this.excludeSelector();
        if (excludeSelector) {
            const excludedElement = (this.elementRef.nativeElement as HTMLElement).querySelector(excludeSelector);
            if (excludedElement?.contains(event.target as Node)) {
                return;
            }
        }

        const deltaX = this.endX - this.startX;

        if (Math.abs(deltaX) < this.threshold()) {
            return;
        }

        if (deltaX < 0) {
            this.swipeLeft.emit();
        } else {
            this.swipeRight.emit();
        }
    }
}

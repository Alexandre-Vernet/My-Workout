import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SwipeDirective } from './swipe.directive';

function touchEvent(type: string, screenX: number, target?: Element): Event {
    const event = new Event(type, { bubbles: true }) as unknown as { changedTouches: { screenX: number }[] };
    event.changedTouches = [{ screenX }];
    if (target) {
        Object.defineProperty(event, 'target', { value: target, configurable: true });
    }
    return event as unknown as Event;
}

@Component({
    template: `
        <div appSwipe [threshold]="20" [excludeSelector]="'.exclude'" (swipeLeft)="onLeft()" (swipeRight)="onRight()">
            <span class="exclude">excluded</span>
        </div>
    `,
    imports: [SwipeDirective],
    standalone: true
})
class HostComponent {
    onLeft = vi.fn();
    onRight = vi.fn();
}

describe('SwipeDirective', () => {
    let fixture: ComponentFixture<HostComponent>;
    let host: HostComponent;
    let element: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [HostComponent] });

        fixture = TestBed.createComponent(HostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        element = fixture.nativeElement.querySelector('div');
    });

    it('emits swipeLeft when swiping past the threshold to the left', () => {
        element.dispatchEvent(touchEvent('touchstart', 100));
        element.dispatchEvent(touchEvent('touchend', 50));

        expect(host.onLeft).toHaveBeenCalledOnce();
        expect(host.onRight).not.toHaveBeenCalled();
    });

    it('emits swipeRight when swiping past the threshold to the right', () => {
        element.dispatchEvent(touchEvent('touchstart', 50));
        element.dispatchEvent(touchEvent('touchend', 100));

        expect(host.onRight).toHaveBeenCalledOnce();
        expect(host.onLeft).not.toHaveBeenCalled();
    });

    it('ignores swipes shorter than the threshold', () => {
        element.dispatchEvent(touchEvent('touchstart', 100));
        element.dispatchEvent(touchEvent('touchend', 90));

        expect(host.onLeft).not.toHaveBeenCalled();
        expect(host.onRight).not.toHaveBeenCalled();
    });

    it('ignores swipes starting on an excluded descendant', () => {
        const excluded = element.querySelector('.exclude') as HTMLElement;

        element.dispatchEvent(touchEvent('touchstart', 100));
        element.dispatchEvent(touchEvent('touchend', 50, excluded));

        expect(host.onLeft).not.toHaveBeenCalled();
    });
});

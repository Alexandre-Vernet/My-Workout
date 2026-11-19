import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreventFocusOnButtonClickDirective } from './prevent-focus-on-button-click.directive';

@Component({
    template: `
        <div appPreventFocusOnButtonClick>
            <input type="text"/>
            <button type="button">+</button>
        </div>
    `,
    imports: [PreventFocusOnButtonClickDirective],
    standalone: true
})
class HostComponent {
}

describe('PreventFocusOnButtonClickDirective', () => {
    let fixture: ComponentFixture<HostComponent>;
    let input: HTMLInputElement;
    let button: HTMLButtonElement;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [HostComponent] });

        fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();

        input = fixture.nativeElement.querySelector('input');
        button = fixture.nativeElement.querySelector('button');
    });

    it('prevents the default mousedown behavior on the button', () => {
        const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true });

        button.dispatchEvent(event);

        expect(event.defaultPrevented).toBe(true);
    });

    it('blurs the input when the button is pressed while the input is focused', () => {
        input.focus();
        expect(document.activeElement).toBe(input);

        button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));

        expect(document.activeElement).not.toBe(input);
    });
});

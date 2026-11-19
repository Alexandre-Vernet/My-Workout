import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NumberStepperComponent } from './number-stepper.component';

describe('NumberStepperComponent', () => {
    let fixture: ComponentFixture<NumberStepperComponent>;
    let component: NumberStepperComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NumberStepperComponent]
        });

        fixture = TestBed.createComponent(NumberStepperComponent);
        component = fixture.componentInstance;
    });

    it('defaults to a null value', () => {
        fixture.detectChanges();

        expect(component.value()).toBeNull();
    });

    it('increment()/decrement() move by the configured step', () => {
        fixture.componentRef.setInput('value', 10);
        fixture.componentRef.setInput('step', 2.5);
        fixture.detectChanges();

        component['increment']();
        expect(component.value()).toBe(12.5);

        component['decrement']();
        component['decrement']();
        expect(component.value()).toBe(7.5);
    });

    it('increment() treats a null value as 0', () => {
        component['increment']();

        expect(component.value()).toBe(1);
    });

    it('clamps to min/max', () => {
        fixture.componentRef.setInput('value', 0);
        fixture.componentRef.setInput('min', 0);
        fixture.componentRef.setInput('max', 5);
        fixture.detectChanges();

        component['decrement']();
        expect(component.value()).toBe(0);

        for (let i = 0; i < 10; i++) {
            component['increment']();
        }
        expect(component.value()).toBe(5);
    });

    it('onInput() parses typed values and clamps them', () => {
        fixture.componentRef.setInput('min', 0);
        fixture.componentRef.setInput('max', 100);
        fixture.detectChanges();

        component['onInput']('42.5');
        expect(component.value()).toBe(42.5);

        component['onInput']('999');
        expect(component.value()).toBe(100);
    });

    it('onInput() clears the value when the field is emptied', () => {
        fixture.componentRef.setInput('value', 10);
        fixture.detectChanges();

        component['onInput']('');

        expect(component.value()).toBeNull();
    });

    it('onInput() ignores non-numeric input', () => {
        fixture.componentRef.setInput('value', 10);
        fixture.detectChanges();

        component['onInput']('abc');

        expect(component.value()).toBe(10);
    });

    it('clicking the +/- buttons updates the value and does not steal focus', () => {
        fixture.componentRef.setInput('value', 1);
        fixture.detectChanges();
        const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.stepper-btn');

        const mousedownEvent = new MouseEvent('mousedown', { cancelable: true });
        buttons[1].dispatchEvent(mousedownEvent);
        expect(mousedownEvent.defaultPrevented).toBe(true);

        buttons[1].click();
        expect(component.value()).toBe(2);
    });

    it('emits blurred when the input loses focus', () => {
        fixture.detectChanges();
        let blurred = false;
        component.blurred.subscribe(() => blurred = true);

        fixture.nativeElement.querySelector('input').dispatchEvent(new FocusEvent('blur'));

        expect(blurred).toBe(true);
    });

    it('disables the buttons and input when disabled', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.stepper-btn');
        expect(buttons[0].disabled).toBe(true);
        expect(buttons[1].disabled).toBe(true);
        expect(fixture.nativeElement.querySelector('input').disabled).toBe(true);
    });
});

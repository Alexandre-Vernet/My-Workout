import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToggleSwitchComponent } from './toggle-switch.component';

describe('ToggleSwitchComponent', () => {
    let fixture: ComponentFixture<ToggleSwitchComponent>;
    let component: ToggleSwitchComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ToggleSwitchComponent]
        });

        fixture = TestBed.createComponent(ToggleSwitchComponent);
        component = fixture.componentInstance;
    });

    it('defaults to unchecked', () => {
        fixture.detectChanges();

        expect(component.checked()).toBe(false);
        expect(fixture.nativeElement.querySelector('button').getAttribute('aria-checked')).toBe('false');
    });

    it('reflects the checked input', () => {
        fixture.componentRef.setInput('checked', true);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('button').classList).toContain('checked');
    });

    it('toggle() flips the checked state', () => {
        component.toggle();
        expect(component.checked()).toBe(true);

        component.toggle();
        expect(component.checked()).toBe(false);
    });

    it('clicking the button toggles the checked state and emits the change', () => {
        fixture.detectChanges();
        let emitted: boolean | undefined;
        component.checked.subscribe(value => emitted = value);

        fixture.nativeElement.querySelector('button').click();

        expect(component.checked()).toBe(true);
        expect(emitted).toBe(true);
    });
});

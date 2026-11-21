import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { I18N } from '../i18n/i18n';

@Component({
    selector: 'app-number-stepper',
    templateUrl: './number-stepper.component.html',
    styleUrl: './number-stepper.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class NumberStepperComponent {

    protected readonly i18n = I18N.common.numberStepper;

    value = model<number | null>(null);
    step = input(1);
    min = input(-Infinity);
    max = input(Infinity);
    suffix = input('');
    disabled = input(false);
    compact = input(false);

    // Fires when the field loses focus, so callers can commit/persist a value
    // without reacting to every keystroke or +/- click (see workout-session's
    // history table, which only saves on blur).
    blurred = output<void>();

    protected increment() {
        this.setValue((this.value() ?? 0) + this.step());
    }

    protected decrement() {
        this.setValue((this.value() ?? 0) - this.step());
    }

    protected onInput(raw: string) {
        if (raw.trim() === '') {
            this.value.set(null);
            return;
        }

        const parsed = Number(raw);
        if (!Number.isNaN(parsed)) {
            this.setValue(parsed);
        }
    }

    private setValue(value: number) {
        this.value.set(Math.min(this.max(), Math.max(this.min(), value)));
    }
}

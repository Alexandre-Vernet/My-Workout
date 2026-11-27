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

    // Fires when a value change should be committed/persisted: on blur after
    // typing (the +/- buttons prevent the input from ever gaining focus via
    // their (mousedown) handler below, so typing is the only path that can
    // ever blur it), and right away on +/- since each click is itself a
    // deliberate, atomic action. This lets callers persist without reacting
    // to every keystroke while still typing (see workout-session's history
    // table, which saves on this event rather than on every valueChange).
    blurred = output<void>();

    protected increment() {
        this.setValue((this.value() ?? 0) + this.step());
        this.blurred.emit();
    }

    protected decrement() {
        this.setValue((this.value() ?? 0) - this.step());
        this.blurred.emit();
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

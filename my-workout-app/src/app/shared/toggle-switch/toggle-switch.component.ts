import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

@Component({
    selector: 'app-toggle-switch',
    templateUrl: './toggle-switch.component.html',
    styleUrl: './toggle-switch.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class ToggleSwitchComponent {

    inputId = input<string>();
    checked = model(false);
    disabled = input(false);

    protected toggle() {
        if (this.disabled()) {
            return;
        }
        this.checked.set(!this.checked());
    }
}

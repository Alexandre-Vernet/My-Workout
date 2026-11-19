import { Component, input, model } from '@angular/core';

@Component({
    selector: 'app-toggle-switch',
    templateUrl: './toggle-switch.component.html',
    styleUrl: './toggle-switch.component.scss',
    standalone: true
})
export class ToggleSwitchComponent {

    inputId = input<string>();
    checked = model(false);

    toggle() {
        this.checked.set(!this.checked());
    }
}

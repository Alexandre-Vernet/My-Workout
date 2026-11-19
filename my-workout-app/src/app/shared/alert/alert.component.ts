import { Component, DestroyRef, effect, inject, ViewEncapsulation } from '@angular/core';
import { Message } from 'primeng/message';
import { AlertService } from '../../services/alert.service';

const AUTO_HIDE_DELAY_MS = 4000;

@Component({
    selector: 'app-alert',
    imports: [Message],
    templateUrl: './alert.component.html',
    styleUrl: './alert.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class AlertComponent {
    protected readonly alertService = inject(AlertService);

    private readonly destroyRef = inject(DestroyRef);
    private hideTimeoutId: ReturnType<typeof setTimeout> | null = null;

    constructor() {
        effect(() => {
            const alert = this.alertService.alert();

            if (this.hideTimeoutId) {
                clearTimeout(this.hideTimeoutId);
                this.hideTimeoutId = null;
            }

            if (alert) {
                this.hideTimeoutId = setTimeout(() => this.alertService.show(null), AUTO_HIDE_DELAY_MS);
            }
        });

        this.destroyRef.onDestroy(() => {
            if (this.hideTimeoutId) {
                clearTimeout(this.hideTimeoutId);
            }
        });
    }
}

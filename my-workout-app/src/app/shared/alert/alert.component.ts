import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { Alert } from '../../../interfaces/alert';
import { I18N } from '../i18n/i18n';

const AUTO_HIDE_DELAY_MS = 4000;

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrl: './alert.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertComponent {
    protected readonly alertService = inject(AlertService);
    protected readonly i18n = I18N.common.alert;

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

    protected severityAccent(severity: Alert['severity']): string {
        switch (severity) {
            case 'success':
                return 'var(--p-green-500)';
            case 'error':
                return 'var(--p-red-500)';
            case 'warn':
                return 'var(--p-orange-500)';
            case 'info':
                return 'var(--p-blue-500)';
            default:
                return 'var(--p-text-muted-color)';
        }
    }
}

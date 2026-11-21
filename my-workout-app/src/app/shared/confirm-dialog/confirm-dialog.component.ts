import { ChangeDetectionStrategy, Component, HostListener, input, output } from '@angular/core';
import { I18N } from '../i18n/i18n';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrl: './confirm-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class ConfirmDialogComponent {

    open = input.required<boolean>();
    title = input(I18N.common.confirmDialog.title);
    message = input.required<string>();
    confirmLabel = input(I18N.common.confirmDialog.confirmLabel);
    cancelLabel = input(I18N.common.confirmDialog.cancelLabel);
    danger = input(false);

    confirmed = output<void>();
    cancelled = output<void>();

    @HostListener('document:keydown.escape')
    protected onEscape() {
        if (this.open()) {
            this.cancelled.emit();
        }
    }
}

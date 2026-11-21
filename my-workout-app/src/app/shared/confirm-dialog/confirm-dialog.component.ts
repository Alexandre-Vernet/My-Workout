import { ChangeDetectionStrategy, Component, HostListener, input, output } from '@angular/core';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrl: './confirm-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class ConfirmDialogComponent {

    open = input.required<boolean>();
    title = input('Confirmation');
    message = input.required<string>();
    confirmLabel = input('Confirmer');
    cancelLabel = input('Annuler');
    danger = input(false);

    confirmed = output<void>();
    cancelled = output<void>();

    @HostListener('document:keydown.escape')
    onEscape() {
        if (this.open()) {
            this.cancelled.emit();
        }
    }
}

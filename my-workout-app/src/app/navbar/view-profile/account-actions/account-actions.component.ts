import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { Alert } from '../../../../interfaces/alert';
import { MenuUrls } from '../../../shared/menu-urls';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { CustomError } from '../../../../interfaces/CustomError';
import { getErrorMessage } from '../../../shared/utils/http-error';
import { I18N } from '../../../shared/i18n/i18n';

@Component({
    selector: 'app-account-actions',
    imports: [ConfirmDialogComponent],
    templateUrl: './account-actions.component.html',
    styleUrl: './account-actions.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class AccountActionsComponent {

    showAlert = output<Alert>();

    protected readonly i18n = I18N.viewProfile.accountActions;
    protected readonly confirmDeleteOpen = signal(false);

    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    protected signOut() {
        this.authService.signOut();
        this.router.navigate([MenuUrls.library]);
    }

    protected openDialogConfirmDeleteAccount() {
        this.confirmDeleteOpen.set(true);
    }

    protected onConfirmDelete() {
        this.confirmDeleteOpen.set(false);
        this.deleteAccount();
    }

    protected onCancelDelete() {
        this.confirmDeleteOpen.set(false);
    }

    private deleteAccount() {
        this.authService.deleteAccount()
            .subscribe({
                next: () => {
                    this.showAlert.emit({
                        message: this.i18n.deleteSuccess,
                        severity: 'success'
                    });

                    this.signOut();
                },
                error: (err: CustomError) => {
                    this.showAlert.emit({
                        severity: 'error',
                        message: getErrorMessage(err, this.i18n.deleteError)
                    });
                }
            });
    }
}

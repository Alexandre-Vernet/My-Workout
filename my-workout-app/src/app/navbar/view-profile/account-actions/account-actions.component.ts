import { Component, inject, output, signal } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { Alert } from '../../../../interfaces/alert';
import { MenuUrls } from '../../../shared/menu-urls';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { CustomError } from '../../../../interfaces/CustomError';
import { getErrorMessage } from '../../../shared/utils/http-error';

@Component({
    selector: 'app-account-actions',
    imports: [ConfirmDialogComponent],
    templateUrl: './account-actions.component.html',
    styleUrl: './account-actions.component.scss',
    standalone: true
})
export class AccountActionsComponent {

    showAlert = output<Alert>();

    protected readonly confirmDeleteOpen = signal(false);

    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    signOut() {
        this.authService.signOut();
        this.router.navigate([MenuUrls.library]);
    }

    openDialogConfirmDeleteAccount() {
        this.confirmDeleteOpen.set(true);
    }

    onConfirmDelete() {
        this.confirmDeleteOpen.set(false);
        this.deleteAccount();
    }

    onCancelDelete() {
        this.confirmDeleteOpen.set(false);
    }

    deleteAccount() {
        this.authService.deleteAccount()
            .subscribe({
                next: () => {
                    this.showAlert.emit({
                        message: 'Votre compte a bien été supprimé',
                        severity: 'success'
                    });

                    this.signOut();
                },
                error: (err: CustomError) => {
                    this.showAlert.emit({
                        severity: 'error',
                        message: getErrorMessage(err, 'Erreur lors de la suppression de votre compte')
                    });
                }
            });
    }
}

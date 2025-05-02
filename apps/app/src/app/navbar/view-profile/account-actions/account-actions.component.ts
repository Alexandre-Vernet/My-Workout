import { Component, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { Subject, take } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { Alert } from '../../../../../../../libs/interfaces/alert';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
    selector: 'app-account-actions',
    imports: [CommonModule, Button, Ripple, ConfirmDialog],
    templateUrl: './account-actions.component.html',
    styleUrl: './account-actions.component.scss',
    standalone: true,
    providers: [ConfirmationService]
})
export class AccountActionsComponent {

    @Output() showAlert = new Subject<Alert>();

    constructor(
        private readonly authService: AuthService,
        private readonly router: Router,
        private readonly confirmationService: ConfirmationService
    ) {
    }

    signOut() {
        this.authService.signOut();
        this.router.navigate(['/auth']);
    }

    openDialogConfirmDeleteAccount() {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Voulez-vous vraiment supprimer votre compte ?',
            header: 'Confirmation',
            icon: 'pi pi-info-circle',
            rejectLabel: 'Annuler',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Supprimer',
                severity: 'danger'
            },
            accept: () => this.deleteAccount()
        });
    }

    deleteAccount() {
        this.authService.deleteAccount()
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.showAlert.next({
                        message: 'Votre compte a bien été supprimé',
                        severity: 'success'
                    });

                    this.signOut();
                },
                error: (err) => {
                    this.showAlert.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Erreur lors de la suppression de votre compte'
                    });
                }
            });
    }
}

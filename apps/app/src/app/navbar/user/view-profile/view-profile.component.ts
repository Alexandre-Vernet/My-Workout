import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/auth.service';
import { take } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { Button } from 'primeng/button';
import { Router } from '@angular/router';
import { Message } from 'primeng/message';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Ripple } from 'primeng/ripple';
import { ChangeThemeComponent } from '../change-theme/change-theme.component';
import { ManageAccountComponent } from '../manage-account/manage-account.component';
import { Alert } from '../../../../../../../libs/interfaces/alert';

@Component({
    selector: 'app-view-profile',
    imports: [CommonModule, ReactiveFormsModule, DropdownModule, FormsModule, Button, Message, ConfirmDialog, Ripple, ChangeThemeComponent, ManageAccountComponent],
    templateUrl: './view-profile.component.html',
    styleUrl: './view-profile.component.scss',
    standalone: true,
    providers: [ConfirmationService]
})
export class ViewProfileComponent implements OnInit {

    alert: Alert;

    isDarkMode = localStorage.getItem('dark-mode') === 'true';

    constructor(
        private readonly authService: AuthService,
        private readonly router: Router,
        private readonly confirmationService: ConfirmationService
    ) {
    }


    ngOnInit() {

    }

    updateDarkMode(value: boolean) {
        this.isDarkMode = value;
    }

    displayAlert(alert: Alert){
        this.alert = alert;
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
                    this.alert = {
                        message: 'Votre compte a bien été supprimé',
                        severity: 'success'
                    };

                    this.signOut();
                },
                error: (err) => {
                    this.alert = {
                        severity: 'error',
                        message: err?.error?.message ?? 'Erreur lors de la suppression de votre compte'
                    };
                }
            });
    }
}

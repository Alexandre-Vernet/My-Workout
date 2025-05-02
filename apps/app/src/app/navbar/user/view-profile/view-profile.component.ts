import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatLabel } from 'primeng/floatlabel';
import { AuthService } from '../../../auth/auth.service';
import { take } from 'rxjs';
import { InputText } from 'primeng/inputtext';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Button } from 'primeng/button';
import { User } from '../../../../../../../libs/interfaces/user';
import { Router } from '@angular/router';
import { Message } from 'primeng/message';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Ripple } from 'primeng/ripple';
import { Password } from 'primeng/password';
import { Divider } from 'primeng/divider';
import { ChangeThemeComponent } from '../change-theme/change-theme.component';

@Component({
    selector: 'app-view-profile',
    imports: [CommonModule, FloatLabel, InputText, ReactiveFormsModule, DropdownModule, FormsModule, ToggleSwitch, Button, Message, ConfirmDialog, Ripple, Password, Divider, ChangeThemeComponent],
    templateUrl: './view-profile.component.html',
    styleUrl: './view-profile.component.scss',
    standalone: true,
    providers: [ConfirmationService]
})
export class ViewProfileComponent implements OnInit {

    currentEmail: string;
    formControlEmail = new FormControl('', [Validators.required, Validators.email, Validators.maxLength(255)]);
    formControlPassword = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]);
    formControlConfirmPassword = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]);


    isCheckedChangePassword: boolean;

    isLoading: boolean;

    alert: {
        severity: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast' | undefined | null,
        message: string | null
    } = {
        severity: null,
        message: null
    };

    isDarkMode = localStorage.getItem('dark-mode') === 'true';

    constructor(
        private readonly authService: AuthService,
        private readonly router: Router,
        private readonly confirmationService: ConfirmationService
    ) {
    }


    ngOnInit() {
        this.authService.user$
            .pipe(take(1))
            .subscribe(user => {
                this.currentEmail = user?.email;
                this.formControlEmail.setValue(user?.email);
            });
    }

    updateDarkMode(value: boolean) {
        this.isDarkMode = value;
    }

    toggleChangePassword(){
        this.isCheckedChangePassword = !this.isCheckedChangePassword;

        if (!this.isCheckedChangePassword) {
            this.formControlPassword.reset();
            this.formControlConfirmPassword.reset();
        }
    }

    updateUser() {
        const user: User = {
            email: this.formControlEmail.value,
            password: this.formControlPassword.value,
            confirmPassword: this.formControlConfirmPassword.value
        };

        this.isLoading = true;

        if (!user.email) {
            delete user.email;
        }
        if (!user.password && !user.confirmPassword) {
            delete user.password;
            delete user.confirmPassword;
        }

        this.authService.updateUser(user)
            .pipe(take(1))
            .subscribe({
                next: (user) => {
                    this.alert = {
                        message: 'Votre compte a bien été mis à jour',
                        severity: 'success'
                    };
                    this.formControlEmail.setValue(user?.email);
                    this.currentEmail = user?.email;
                    this.isLoading = false;
                },
                error: (err) => {
                    this.alert = {
                        severity: 'error',
                        message: err?.error?.message ?? 'Erreur lors de la mise à jour de votre compte'
                    };
                    this.isLoading = false;
                }
            });
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

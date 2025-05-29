import { Component, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Password } from 'primeng/password';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { User } from '../../../../../../../libs/interfaces/user';
import { Subject, take } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { Alert } from '../../../../../../../libs/interfaces/alert';
import { Ripple } from 'primeng/ripple';

@Component({
    selector: 'app-manage-account',
    imports: [CommonModule, Button, FloatLabel, FormsModule, InputText, Message, Password, ToggleSwitch, ReactiveFormsModule, Ripple],
    templateUrl: './manage-account.component.html',
    styleUrl: './manage-account.component.scss',
    standalone: true
})
export class ManageAccountComponent implements OnInit {

    currentEmail: string;
    formControlEmail = new FormControl('', [Validators.required, Validators.email, Validators.maxLength(255)]);
    formControlPassword = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]);
    formControlConfirmPassword = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]);


    isCheckedChangePassword: boolean;

    isLoading: boolean;

    @Output() showAlert = new Subject<Alert>();

    constructor(
        private readonly authService: AuthService
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

    toggleChangePassword() {
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
                    this.showAlert.next({
                        message: 'Votre compte a bien été mis à jour',
                        severity: 'success'
                    });

                    this.formControlEmail.setValue(user?.email);
                    this.currentEmail = user?.email;
                    this.isLoading = false;
                },
                error: (err) => {
                    this.showAlert.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Erreur lors de la mise à jour de votre compte'
                    });

                    this.isLoading = false;
                }
            });
    }
}

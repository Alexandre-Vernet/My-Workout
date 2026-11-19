import { Component, inject, model } from '@angular/core';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../services/alert.service';
import { NgClass } from '@angular/common';
import { PasswordResetTokenService } from "../password-reset-token.service";
import { getErrorMessage } from "../../shared/utils/http-error";

@Component({
    selector: 'app-forgot-password',
    imports: [Button, Dialog, FloatLabel, InputText, Message, ReactiveFormsModule, NgClass],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.scss',
    standalone: true
})
export class ForgotPasswordComponent {

    showDialogForgotPassword = model(false);

    email = new FormControl('', Validators.email);

    isLoading = false;

    private readonly passwordResetTokenService = inject(PasswordResetTokenService);
    private readonly alertService = inject(AlertService);

    forgotPassword() {
        this.isLoading = true;

        const email = this.email.value ?? '';

        this.passwordResetTokenService.forgotPassword(email)
            .subscribe({
                next: () => {
                    this.closeModal();
                    this.isLoading = false;

                    this.alertService.show({
                        severity: 'success',
                        message: 'Si un compte existe pour cet email, un lien de réinitialisation vous a été envoyé'
                    });
                },
                error: (err) => {
                    this.isLoading = false;

                    this.alertService.show({
                        severity: 'error',
                        message: getErrorMessage(err, 'Une erreur s\'est produite, veuillez réessayer')
                    });
                }
            });
    }

    closeModal() {
        this.showDialogForgotPassword.set(false);
    }
}

import { Component, inject, model } from '@angular/core';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { environment } from '../../../environments/environment';
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
        const { appName, logoUrl } = environment;

        this.passwordResetTokenService.forgotPassword(email)
            .subscribe({
                next: ({ link }) => {
                    emailjs.send(environment.EMAIL_JS.SERVICE_ID, environment.EMAIL_JS.TEMPLATE_ID, {
                            linkResetPassword: link,
                            email,
                            appName,
                            logoUrl
                        },
                        environment.EMAIL_JS.PUBLIC_KEY
                    ).then(
                        () => {
                            this.closeModal();
                            this.isLoading = false;

                            this.alertService.show({
                                severity: 'success',
                                message: 'Un email vous a été envoyé pour réinitialiser votre mot de passe'
                            });
                        },
                        () => {
                            this.isLoading = false;

                            this.alertService.show({
                                severity: 'error',
                                message: 'Une erreur s`est produite lors de l`envoi de l`email'
                            });
                        }
                    );
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

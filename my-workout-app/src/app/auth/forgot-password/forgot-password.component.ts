import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../services/alert.service';
import { PasswordResetTokenService } from "../password-reset-token.service";
import { getErrorMessage } from "../../shared/utils/http-error";

@Component({
    selector: 'app-forgot-password',
    imports: [ReactiveFormsModule],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class ForgotPasswordComponent {

    showDialogForgotPassword = model(false);

    email = new FormControl('', Validators.email);

    protected readonly isLoading = signal(false);

    private readonly passwordResetTokenService = inject(PasswordResetTokenService);
    private readonly alertService = inject(AlertService);

    forgotPassword() {
        this.isLoading.set(true);

        const email = this.email.value ?? '';

        this.passwordResetTokenService.forgotPassword(email)
            .subscribe({
                next: () => {
                    this.closeModal();
                    this.isLoading.set(false);

                    this.alertService.show({
                        severity: 'success',
                        message: 'Si un compte existe pour cet email, un lien de réinitialisation vous a été envoyé'
                    });
                },
                error: (err) => {
                    this.isLoading.set(false);

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

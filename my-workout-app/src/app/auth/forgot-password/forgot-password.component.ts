import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../services/alert.service';
import { PasswordResetTokenService } from "../password-reset-token.service";
import { getErrorMessage } from "../../shared/utils/http-error";
import { I18N } from '../../shared/i18n/i18n';

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
    protected readonly i18n = I18N.auth.forgotPassword;

    private readonly passwordResetTokenService = inject(PasswordResetTokenService);
    private readonly alertService = inject(AlertService);

    protected forgotPassword() {
        this.isLoading.set(true);

        const email = this.email.value ?? '';

        this.passwordResetTokenService.forgotPassword(email)
            .subscribe({
                next: () => {
                    this.closeModal();
                    this.isLoading.set(false);

                    this.alertService.show({
                        severity: 'success',
                        message: this.i18n.successMessage
                    });
                },
                error: (err) => {
                    this.isLoading.set(false);

                    this.alertService.show({
                        severity: 'error',
                        message: getErrorMessage(err, this.i18n.errorFallback)
                    });
                }
            });
    }

    protected closeModal() {
        this.showDialogForgotPassword.set(false);
    }
}

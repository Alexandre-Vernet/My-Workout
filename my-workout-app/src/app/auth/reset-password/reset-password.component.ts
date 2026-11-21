import { ChangeDetectionStrategy, Component, effect, input, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomError } from "../../../interfaces/CustomError";
import { getErrorMessage } from "../../shared/utils/http-error";
import { PasswordResetTokenService } from "../password-reset-token.service";
import { I18N } from '../../shared/i18n/i18n';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    imports: [ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class ResetPasswordComponent {
    private readonly passwordResetTokenService = inject(PasswordResetTokenService);
    private readonly router = inject(Router);

    token = input.required<string>();

    formResetPassword = new FormGroup({
        newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
    });

    protected readonly i18n = I18N.auth.resetPassword;

    constructor() {
        effect(() => this.isTokenValid(this.token()));
    }

    private isTokenValid(token: string) {
        this.passwordResetTokenService.isTokenValid(token)
            .subscribe({
                next: (isTokenValid) => {
                    if (!isTokenValid) {
                        this.redirectToSignIn();
                    }
                },
                error: () => this.redirectToSignIn()
            });
    }

    protected redirectToSignIn() {
        this.router.navigate(['/auth/login']);
    }

    protected submitForm() {
        if (this.formResetPassword.valid) {
            const { newPassword, confirmPassword } = this.formResetPassword.value;
            if (newPassword !== confirmPassword) {
                this.formResetPassword.setErrors({ error: this.i18n.passwordsDoNotMatch });
                return;
            }
            this.resetPassword(newPassword ?? '');
        }
        return;
    }

    private resetPassword(password: string) {
        this.passwordResetTokenService.resetPassword(this.token(), password)
            .subscribe({
                next: () => this.redirectToSignIn(),
                error: (err: CustomError) => this.formResetPassword.setErrors({
                    error: getErrorMessage(err, this.i18n.errorFallback)
                })
            });
    }
}

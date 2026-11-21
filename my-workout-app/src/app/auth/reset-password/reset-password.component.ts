import { ChangeDetectionStrategy, Component, input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomError } from "../../../interfaces/CustomError";
import { getErrorMessage } from "../../shared/utils/http-error";
import { PasswordResetTokenService } from "../password-reset-token.service";

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    imports: [ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class ResetPasswordComponent implements OnInit {
    private readonly passwordResetTokenService = inject(PasswordResetTokenService);
    private readonly router = inject(Router);

    token = input.required<string>();

    formResetPassword = new FormGroup({
        newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
    });

    ngOnInit() {
        this.isTokenValid(this.token());
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

    redirectToSignIn() {
        this.router.navigate(['/auth/login']);
    }

    submitForm() {
        if (this.formResetPassword.valid) {
            const { newPassword, confirmPassword } = this.formResetPassword.value;
            if (newPassword !== confirmPassword) {
                this.formResetPassword.setErrors({ error: 'Passwords do not match' });
                return;
            }
            this.resetPassword(newPassword ?? '');
        }
        return;
    }

    resetPassword(password: string) {
        this.passwordResetTokenService.resetPassword(this.token(), password)
            .subscribe({
                next: () => this.redirectToSignIn(),
                error: (err: CustomError) => this.formResetPassword.setErrors({
                    error: getErrorMessage(err, 'Une erreur s\'est produite')
                })
            });
    }
}

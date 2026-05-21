import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { Message } from 'primeng/message';
import { Password } from 'primeng/password';
import { PasswordResetTokenService } from "../password-reset-token.service";

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    imports: [
        ReactiveFormsModule,
        NgClass,
        Button,
        Dialog,
        FloatLabel,
        Message,
        Password
    ],
    standalone: true
})
export class ResetPasswordComponent implements OnInit {
    formResetPassword = new FormGroup({
        newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
    });

    token: string;

    constructor(
        private readonly passwordResetTokenService: PasswordResetTokenService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit() {
        const token = this.activatedRoute.snapshot.queryParamMap.get('token');
        this.isTokenValid(token);
        this.token = token;
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
            this.resetPassword(newPassword);
        }
        return;
    }

    resetPassword(password: string) {
        this.passwordResetTokenService.resetPassword(this.token, password)
            .subscribe({
                next: () => this.redirectToSignIn(),
                error: (err) => this.formResetPassword.setErrors({ error: err.error.message ?? 'Une erreur s\'est produite' })
            });
    }
}

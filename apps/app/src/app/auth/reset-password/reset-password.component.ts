import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { Message } from 'primeng/message';
import { Password } from 'primeng/password';
import { User } from '../../../../../../libs/interfaces/user';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    imports: [
        ReactiveFormsModule,
        NgClass,
        NgIf,
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

    user: User;

    constructor(
        private readonly authService: AuthService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit() {
        const token = this.activatedRoute.snapshot.queryParamMap.get('token');
        this.verifyToken(token);
    }

    private verifyToken(token: string) {
        this.authService.verifyToken(token)
            .subscribe({
                next: (user) => this.user = user,
                error: () => {
                    // TODO Add pop-up : invalid token
                    this.redirectToSignIn();
                }
            });
    }

    redirectToSignIn() {
        this.router.navigate(['/auth/sign-in']);
    }

    submitForm() {
        if (this.formResetPassword.valid) {
            const { newPassword, confirmPassword } = this.formResetPassword.value;
            if (newPassword !== confirmPassword) {
                this.formResetPassword.setErrors({ error: 'Passwords do not match' });
                return;
            }
            this.resetPassword();
        }
        return;
    }

    resetPassword() {
        const userId = this.user.id;
        const password = this.formResetPassword.controls.newPassword.value;

        this.authService.updatePassword(userId, password)
            .subscribe({
                next: () => {
                    this.formResetPassword.reset();
                    this.router.navigate(['/']);
                },
                error: (err) => {
                    if (err.error?.message) {
                        this.formResetPassword.setErrors({ error: err.error.message });
                    }
                }
            });
    }
}

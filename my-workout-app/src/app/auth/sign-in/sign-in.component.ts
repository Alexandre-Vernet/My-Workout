import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { Message } from 'primeng/message';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { Alert } from '../../../interfaces/alert';
import { User } from '../../../interfaces/user';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['../auth.component.scss'],
    imports: [
        ReactiveFormsModule,
        RouterLink,
        NgClass,
        Message,
        ForgotPasswordComponent
    ]
})
export class SignInComponent {

    formSignIn = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required])
    });


    showDialogForgotPassword: boolean;

    alert: Alert;

    constructor(
        private readonly authService: AuthService,
        private router: Router
    ) {
    }

    signIn() {
        const {
            email,
            password
        } = this.formSignIn.value;

        const user: User = {
            email: email.toLowerCase(),
            password
        };

        this.authService.login(user)
            .subscribe({
                next: () => this.router.navigateByUrl('/'),
                error: (err) => {
                    if (err?.error?.errorCode) {
                        this.formSignIn.setErrors({ [err.error.errorCode]: err?.error?.message ?? 'Une erreur s\'est produite' });
                    } else {
                        this.formSignIn.setErrors({ unknownError: 'Une erreur s\'est produite' });
                    }
                }
            });
    }
}

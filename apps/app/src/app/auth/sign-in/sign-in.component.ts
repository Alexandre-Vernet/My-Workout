import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../../../../libs/interfaces/user';
import { NgClass, NgIf } from '@angular/common';
import { faUser, faLock, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Message } from 'primeng/message';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import emailjs from '@emailjs/browser';
import { environment } from '../../../environments/environment';
import { Alert } from '../../../../../../libs/interfaces/alert';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['../auth.component.scss'],
    imports: [
        ReactiveFormsModule,
        RouterLink,
        NgIf,
        NgClass,
        FontAwesomeModule,
        Message,
        Dialog,
        InputText,
        Button,
        FloatLabel
    ]
})
export class SignInComponent {
    faIcons = {
        faUser,
        faLock,
        faChevronRight
    };

    formSignIn = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required])
    });

    formResetPasswordEmail = new FormControl(this.formSignIn.controls.email.value, Validators.email);

    showDialogResetPassword: boolean;
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
            email,
            password
        };

        this.authService.signIn(user)
            .subscribe({
                next: () => this.router.navigateByUrl('/'),
                error: (err) => this.formSignIn.setErrors({ [err.error.errorCode]: err.error.message })
            });
    }

    resetPassword() {
        const email = this.formResetPasswordEmail.value;

        this.authService.sendEmailForgotPassword(email)
            .subscribe({
                next: ({ linkResetPassword }) => {
                    this.showDialogResetPassword = false;

                    emailjs.send(environment.EMAIL_JS.SERVICE_ID, environment.EMAIL_JS.TEMPLATE_ID, {
                            linkResetPassword,
                            email
                        },
                        environment.EMAIL_JS.PUBLIC_KEY
                    ).then(
                        () => {
                            this.alert = {
                                severity: 'success',
                                message: 'Un email vous a été envoyé pour réinitialiser votre mot de passe'
                            };
                        },
                        () => {
                            this.alert = {
                                severity: 'error',
                                message: 'Une erreur s`est produite lors de l`envoi de l`email'
                            };
                        }
                    );
                }
            });
    }
}

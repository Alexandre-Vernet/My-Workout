import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { faChevronRight, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Message } from 'primeng/message';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { Alert } from '../../../interfaces/alert';
import { User } from '../../../interfaces/user';
import { Preferences } from "@capacitor/preferences";

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
        ForgotPasswordComponent
    ]
})
export class SignInComponent implements OnInit {

    faIcons = {
        faUser,
        faLock,
        faChevronRight
    };

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

    ngOnInit() {
        Preferences.get({ key: 'email' })
            .then((email) => {
                if (email) {
                    this.formSignIn.controls.email.setValue(email.value);
                }
            })
            .catch((e) => console.warn("Could not retrieve email from preferences", e));
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

        this.authService.signIn(user)
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

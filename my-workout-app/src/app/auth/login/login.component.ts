import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { Message } from 'primeng/message';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoginRequest } from "../../../interfaces/LoginRequest";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['../auth.component.scss'],
    imports: [
        ReactiveFormsModule,
        RouterLink,
        NgClass,
        Message,
        ForgotPasswordComponent
    ]
})
export class LoginComponent {

    formLogin = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required])
    });

    showDialogForgotPassword: boolean;

    constructor(
        private readonly authService: AuthService,
        private readonly router: Router
    ) {
    }

    signIn() {
        const {
            email,
            password
        } = this.formLogin.value;

        const loginRequest = new LoginRequest(email?.trim(), password);

        this.authService.login(loginRequest)
            .subscribe({
                next: () => this.router.navigateByUrl('/'),
                error: () => this.formLogin.setErrors({ badCredential: true })
            });
    }
}

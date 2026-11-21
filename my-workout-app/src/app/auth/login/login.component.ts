import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoginRequest } from "../../../interfaces/LoginRequest";
import { I18N } from '../../shared/i18n/i18n';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['../auth.component.scss'],
    imports: [
        ReactiveFormsModule,
        RouterLink,
        NgClass,
        ForgotPasswordComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

    formLogin = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required])
    });

    showDialogForgotPassword = false;

    protected readonly i18n = I18N.auth.login;

    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    protected signIn() {
        const {
            email,
            password
        } = this.formLogin.value;

        const loginRequest = new LoginRequest(email?.trim() ?? '', password ?? '');

        this.authService.login(loginRequest)
            .subscribe({
                next: () => this.router.navigateByUrl('/'),
                error: () => this.formLogin.setErrors({ badCredential: true })
            });
    }
}

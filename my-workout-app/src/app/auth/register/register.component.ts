import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { CustomError } from "../../../interfaces/CustomError";
import { RegisterRequest } from "../../../interfaces/RegisterRequest";
import { applyValidationErrors, getErrorCode, isValidationError } from "../../shared/utils/http-error";
import { I18N } from '../../shared/i18n/i18n';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['../auth.component.scss'],
    imports: [
        ReactiveFormsModule,
        RouterLink
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {

    protected readonly formRegister = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
    });

    protected readonly i18n = I18N.auth.register;

    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    protected signUp() {
        const {
            email,
            password,
            confirmPassword
        } = this.formRegister.value;

        if (password !== confirmPassword) {
            this.formRegister.controls.password.setErrors({ passwordNotMatch: true });
            return;
        }

        const registerRequest = new RegisterRequest(email?.trim() ?? '', password ?? '', confirmPassword ?? '');

        this.authService.register(registerRequest)
            .subscribe({
                next: () => this.router.navigateByUrl('/'),
                error: (err: CustomError) => {
                    if (isValidationError(err)) {
                        applyValidationErrors(err, this.formRegister);
                    } else {
                        const errorCode = getErrorCode(err);
                        if (errorCode === 'EMAIL_ALREADY_IN_USE') {
                            this.formRegister.controls.email.setErrors({
                                emailAlreadyInUse: true
                            });
                        } else if (errorCode === 'PASSWORD_NOT_MATCH') {
                            this.formRegister.controls.password.setErrors({
                                passwordNotMatch: true
                            });
                        } else {
                            this.formRegister.controls.email.setErrors({
                                unknownError: true
                            });
                        }
                    }
                }
            });
    }
}

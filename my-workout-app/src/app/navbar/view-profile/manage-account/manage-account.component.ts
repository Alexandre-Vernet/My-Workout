import { ChangeDetectionStrategy, Component, effect, inject, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateUserRequest } from '../../../../interfaces/UpdateUserRequest';
import { AuthService } from '../../../auth/auth.service';
import { Alert } from '../../../../interfaces/alert';
import { Router } from "@angular/router";
import { CustomError } from "../../../../interfaces/CustomError";
import { applyValidationErrors, getErrorCode, isValidationError } from "../../../shared/utils/http-error";
import { ToggleSwitchComponent } from '../../../shared/toggle-switch/toggle-switch.component';
import { I18N } from '../../../shared/i18n/i18n';

@Component({
    selector: 'app-manage-account',
    imports: [ReactiveFormsModule, ToggleSwitchComponent],
    templateUrl: './manage-account.component.html',
    styleUrl: './manage-account.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class ManageAccountComponent {

    protected readonly i18n = I18N.viewProfile.manageAccount;
    protected readonly currentEmail = signal<string | undefined>(undefined);
    formGroup = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(255)]),
        password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]),
    });


    isCheckedChangePassword = false;

    showAlert = output<Alert>();

    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    constructor() {
        effect(() => {
            this.authService.getCurrentUser()
                .subscribe(user => {
                    this.currentEmail.set(user?.email);
                    this.formGroup.controls.email.setValue(user?.email);
                });
        });
    }

    protected toggleChangePassword() {
        this.isCheckedChangePassword = !this.isCheckedChangePassword;

        if (!this.isCheckedChangePassword) {
            this.formGroup.controls.password.reset();
            this.formGroup.controls.confirmPassword.reset();
        }
    }

    protected updateUser() {
        const { email, password, confirmPassword } = this.formGroup.value;
        const user: UpdateUserRequest = {};

        if (email) {
            user.email = email;
        }
        if (password && confirmPassword) {
            user.password = password;
            user.confirmPassword = confirmPassword;
        }

        this.authService.updateUser(user)
            .subscribe({
                next: () => {
                    this.router.navigate(['/auth/login']);
                    this.showAlert.emit({
                        message: this.i18n.updateSuccess,
                        severity: 'success'
                    });
                },
                error: (err: CustomError) => {
                    if (isValidationError(err)) {
                        applyValidationErrors(err, this.formGroup);
                    } else {
                        if (getErrorCode(err) === 'EMAIL_ALREADY_IN_USE') {
                            this.formGroup.controls.email.setErrors({
                                emailAlreadyInUse: true
                            });
                        } else {
                            this.formGroup.controls.email.setErrors({
                                unknownError: true
                            });
                        }
                    }
                }
            });
    }
}

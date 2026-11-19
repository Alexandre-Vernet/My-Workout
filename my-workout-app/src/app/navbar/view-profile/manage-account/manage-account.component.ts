import { Component, inject, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateUserRequest } from '../../../../interfaces/UpdateUserRequest';
import { AuthService } from '../../../auth/auth.service';
import { Alert } from '../../../../interfaces/alert';
import { Router } from "@angular/router";
import { CustomError } from "../../../../interfaces/CustomError";
import { applyValidationErrors, getErrorCode, isValidationError } from "../../../shared/utils/http-error";
import { ToggleSwitchComponent } from '../../../shared/toggle-switch/toggle-switch.component';

@Component({
    selector: 'app-manage-account',
    imports: [ReactiveFormsModule, ToggleSwitchComponent],
    templateUrl: './manage-account.component.html',
    styleUrl: './manage-account.component.scss',
    standalone: true
})
export class ManageAccountComponent implements OnInit {

    currentEmail: string | undefined;
    formGroup = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(255)]),
        password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]),
    });


    isCheckedChangePassword = false;

    showAlert = output<Alert>();

    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    ngOnInit() {
        this.authService.getCurrentUser()
            .subscribe(user => {
                this.currentEmail = user?.email;
                this.formGroup.controls.email.setValue(user?.email);
            });
    }

    toggleChangePassword() {
        this.isCheckedChangePassword = !this.isCheckedChangePassword;

        if (!this.isCheckedChangePassword) {
            this.formGroup.controls.password.reset();
            this.formGroup.controls.confirmPassword.reset();
        }
    }

    updateUser() {
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
                        message: 'Votre compte a bien été mis à jour, veuillez vous reconnecter',
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

import { Component, OnInit, Output } from '@angular/core';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { User } from '../../../../interfaces/User';
import { Subject } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { Alert } from '../../../../interfaces/alert';
import { Ripple } from 'primeng/ripple';
import { Router } from "@angular/router";
import { Error } from "../../../../interfaces/Error";

@Component({
    selector: 'app-manage-account',
    imports: [Button, FloatLabel, FormsModule, InputText, Message, ToggleSwitch, ReactiveFormsModule, Ripple],
    templateUrl: './manage-account.component.html',
    styleUrl: './manage-account.component.scss',
    standalone: true
})
export class ManageAccountComponent implements OnInit {

    currentEmail: string;
    formGroup = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(255)]),
        password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]),
    });


    isCheckedChangePassword: boolean;

    @Output() showAlert = new Subject<Alert>();

    constructor(
        private readonly authService: AuthService,
        private readonly router: Router
    ) {
    }

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
        const user: User = { email, password, confirmPassword };

        if (!user.email) {
            delete user.email;
        }
        if (!user.password && !user.confirmPassword) {
            delete user.password;
            delete user.confirmPassword;
        }

        this.authService.updateUser(user)
            .subscribe({
                next: () => {
                    this.router.navigate(['/auth/login']);
                    this.showAlert.next({
                        message: 'Votre compte a bien été mis à jour, veuillez vous reconnecter',
                        severity: 'success'
                    });
                },
                error: (err: Error) => {
                    if (err.error.type === 'VALIDATION') {
                        err.error.errors.forEach(error => {
                            this.formGroup.get(error.field).setErrors({
                                validation: error.message
                            })
                        });
                    } else {
                        if (err.error.errorCode === 'EMAIL_ALREADY_IN_USE') {
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

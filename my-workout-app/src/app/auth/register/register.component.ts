import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { Message } from 'primeng/message';
import { CustomError } from "../../../interfaces/CustomError";
import { RegisterRequest } from "../../../interfaces/RegisterRequest";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['../auth.component.scss'],
    imports: [
        ReactiveFormsModule,
        RouterLink,
        NgClass,
        Message
    ]
})
export class RegisterComponent {

    formRegister = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
    });

    constructor(
        private readonly authService: AuthService,
        private readonly router: Router
    ) {
    }

    signUp() {
        const {
            email,
            password,
            confirmPassword
        } = this.formRegister.value;

        if (password !== confirmPassword) {
            this.formRegister.setErrors({ passwordNotMatch: true });
            return;
        }

        const registerRequest = new RegisterRequest(email?.trim(), password, confirmPassword);

        this.authService.register(registerRequest)
            .subscribe({
                next: () => this.router.navigateByUrl('/'),
                error: (err: CustomError) => {
                    if (err.error.type === 'VALIDATION') {
                        err.error.errors.forEach(error => {
                            this.formRegister.get(error.field).setErrors({
                                validation: error.message
                            })
                        });
                    } else {
                        if (err.error.errorCode === 'EMAIL_ALREADY_IN_USE') {
                            this.formRegister.controls.email.setErrors({
                                emailAlreadyInUse: true
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

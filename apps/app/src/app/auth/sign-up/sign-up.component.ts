import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../../../../libs/interfaces/user';
import { NgClass, NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faChevronRight, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { Message } from 'primeng/message';

@Component({
    selector: 'superstore-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['../auth.component.scss'],
    imports: [
        ReactiveFormsModule,
        RouterLink,
        NgIf,
        NgClass,
        FaIconComponent,
        Message
    ]
})
export class SignUpComponent {

    faIcons = {
        faUser: faUser,
        faLock: faLock,
        faChevronRight: faChevronRight
    };

    formSignUp = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
    });

    constructor(
        private readonly authService: AuthService,
        private router: Router
    ) {
    }

    signUp() {
        const {
            email,
            password,
            confirmPassword
        } = this.formSignUp.value;

        if (password !== confirmPassword) {
            this.formSignUp.setErrors({ passwordNotMatch: 'Passwords does not match' });
            return;
        }

        const user: User = {
            email,
            password,
            confirmPassword
        };
        this.authService.signUp(user)
            .subscribe({
                next: () => this.router.navigateByUrl('/'),
                error: (err) => this.formSignUp.setErrors({ [err.error.errorCode]: err.error.message })
            });
    }
}

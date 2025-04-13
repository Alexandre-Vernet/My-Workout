import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../../../../libs/interfaces/user';
import { NgClass, NgIf } from '@angular/common';
import { faUser, faLock, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'superstore-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['../auth.component.scss'],
    imports: [
        ReactiveFormsModule,
        RouterLink,
        NgIf,
        NgClass,
        FontAwesomeModule
    ]
})
export class SignInComponent {
    faIcons = {
        faUser: faUser,
        faLock: faLock,
        faChevronRight: faChevronRight
    };

    formSignIn = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });

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
}

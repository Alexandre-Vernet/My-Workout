import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { RegisterComponent } from './register.component';
import { AuthService } from '../auth.service';

describe('RegisterComponent', () => {
    let fixture: ComponentFixture<RegisterComponent>;
    let component: RegisterComponent;
    let httpMock: HttpTestingController;
    let authService: AuthService;
    let router: Router;

    beforeEach(() => {
        localStorage.clear();

        TestBed.configureTestingModule({
            imports: [RegisterComponent],
            providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
        });

        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        authService = TestBed.inject(AuthService);
        router = TestBed.inject(Router);

        component.formRegister.setValue({
            email: 'alex@example.com',
            password: 'secret1',
            confirmPassword: 'secret1'
        });
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('rejects mismatched passwords locally, without any HTTP call', () => {
        component.formRegister.controls.confirmPassword.setValue('different');

        component.signUp();

        httpMock.expectNone(`${ authService.authUrl }/register`);
        expect(component.formRegister.controls.password.hasError('passwordNotMatch')).toBe(true);
    });

    it('navigates home after a successful registration', () => {
        const navigateSpy = vi.spyOn(router, 'navigateByUrl');

        component.signUp();

        httpMock.expectOne(`${ authService.authUrl }/register`).flush({ accessToken: 'a', user: {} });
        httpMock.expectOne(`${ authService.authUrl }/login`).flush({ accessToken: 'a', refreshToken: 'r' });

        expect(navigateSpy).toHaveBeenCalledWith('/');
    });

    it('applies server-side validation errors to the matching controls', () => {
        component.signUp();

        httpMock.expectOne(`${ authService.authUrl }/register`).flush({
            type: 'VALIDATION',
            errors: [{ field: 'email', message: 'Email already taken' }]
        }, { status: 400, statusText: 'Bad Request' });

        expect(component.formRegister.controls.email.errors).toEqual({ validation: 'Email already taken' });
    });

    it('flags the email field when the server reports it is already in use', () => {
        component.signUp();

        httpMock.expectOne(`${ authService.authUrl }/register`).flush({
            type: 'BUSINESS', errorCode: 'EMAIL_ALREADY_IN_USE'
        }, { status: 409, statusText: 'Conflict' });

        expect(component.formRegister.controls.email.hasError('emailAlreadyInUse')).toBe(true);
        expect(component.formRegister.controls.email.hasError('unknownError')).toBe(false);
    });

    it('flags the password field when the server reports a password mismatch', () => {
        component.signUp();

        httpMock.expectOne(`${ authService.authUrl }/register`).flush({
            type: 'BUSINESS', errorCode: 'PASSWORD_NOT_MATCH'
        }, { status: 400, statusText: 'Bad Request' });

        expect(component.formRegister.controls.password.hasError('passwordNotMatch')).toBe(true);
    });

    it('falls back to an unknown-error flag on the email field for any other business error', () => {
        component.signUp();

        httpMock.expectOne(`${ authService.authUrl }/register`).flush({
            type: 'BUSINESS', errorCode: 'SOMETHING_ELSE'
        }, { status: 500, statusText: 'Server Error' });

        expect(component.formRegister.controls.email.hasError('unknownError')).toBe(true);
    });
});

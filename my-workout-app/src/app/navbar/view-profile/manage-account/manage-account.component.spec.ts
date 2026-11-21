import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { ManageAccountComponent } from './manage-account.component';
import { AuthService } from '../../../auth/auth.service';

@Component({ template: '', standalone: true })
class StubComponent {
}

describe('ManageAccountComponent', () => {
    let fixture: ComponentFixture<ManageAccountComponent>;
    let component: ManageAccountComponent;
    let httpMock: HttpTestingController;
    let authService: AuthService;

    beforeEach(() => {
        localStorage.clear();

        TestBed.configureTestingModule({
            imports: [ManageAccountComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([{ path: '**', component: StubComponent }])
            ]
        });

        fixture = TestBed.createComponent(ManageAccountComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        authService = TestBed.inject(AuthService);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('pre-fills the email field with the current user on init', () => {
        fixture.detectChanges();

        httpMock.expectOne(`${ authService.authUrl }/me`).flush({ id: 1, email: 'alex@example.com' });

        expect(component['currentEmail']()).toBe('alex@example.com');
        expect(component.formGroup.controls.email.value).toBe('alex@example.com');
    });

    it('toggleChangePassword() resets the password fields when turned back off', () => {
        fixture.detectChanges();
        httpMock.expectOne(`${ authService.authUrl }/me`).flush({ id: 1, email: 'alex@example.com' });

        component['toggleChangePassword']();
        component.formGroup.controls.password.setValue('secret1');
        component.formGroup.controls.confirmPassword.setValue('secret1');

        component['toggleChangePassword']();

        expect(component.isCheckedChangePassword).toBe(false);
        expect(component.formGroup.controls.password.value).toBeNull();
        expect(component.formGroup.controls.confirmPassword.value).toBeNull();
    });

    it('updateUser() only sends the email when the password fields are untouched', () => {
        fixture.detectChanges();
        httpMock.expectOne(`${ authService.authUrl }/me`).flush({ id: 1, email: 'alex@example.com' });

        component.formGroup.controls.email.setValue('new@example.com');
        component['updateUser']();

        const req = httpMock.expectOne(`${ authService.authUrl }/1`);
        expect(req.request.body).toEqual({ email: 'new@example.com' });
        req.flush({ id: 1, email: 'new@example.com' });
    });

    it('updateUser() redirects to login and shows a success alert', () => {
        fixture.detectChanges();
        httpMock.expectOne(`${ authService.authUrl }/me`).flush({ id: 1, email: 'alex@example.com' });

        const router = TestBed.inject(Router);
        const navigateSpy = vi.spyOn(router, 'navigate');
        let emitted: unknown;
        component.showAlert.subscribe(alert => emitted = alert);

        component['updateUser']();
        httpMock.expectOne(`${ authService.authUrl }/1`).flush({ id: 1, email: 'alex@example.com' });

        expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
        expect(emitted).toEqual({
            message: 'Votre compte a bien été mis à jour, veuillez vous reconnecter',
            severity: 'success'
        });
    });

    it('flags the email field when the server reports it is already in use', () => {
        fixture.detectChanges();
        httpMock.expectOne(`${ authService.authUrl }/me`).flush({ id: 1, email: 'alex@example.com' });

        component.formGroup.controls.email.setValue('taken@example.com');
        component['updateUser']();

        httpMock.expectOne(`${ authService.authUrl }/1`).flush(
            { type: 'BUSINESS', errorCode: 'EMAIL_ALREADY_IN_USE' },
            { status: 409, statusText: 'Conflict' }
        );

        expect(component.formGroup.controls.email.hasError('emailAlreadyInUse')).toBe(true);
    });
});

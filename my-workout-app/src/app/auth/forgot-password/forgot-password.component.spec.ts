import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { PasswordResetTokenService } from '../password-reset-token.service';
import { AlertService } from '../../services/alert.service';

describe('ForgotPasswordComponent', () => {
    let fixture: ComponentFixture<ForgotPasswordComponent>;
    let component: ForgotPasswordComponent;
    let httpMock: HttpTestingController;
    let passwordResetTokenService: PasswordResetTokenService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ForgotPasswordComponent],
            providers: [provideHttpClient(), provideHttpClientTesting()]
        });

        fixture = TestBed.createComponent(ForgotPasswordComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        passwordResetTokenService = TestBed.inject(PasswordResetTokenService);

        component.email.setValue('alex@example.com');
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('shows a success alert once the reset token request completes', () => {
        const alertService = TestBed.inject(AlertService);

        component.forgotPassword();

        httpMock.expectOne(r => r.url === `${ passwordResetTokenService.passwordResetTokenUrl }/forgot-password`)
            .flush(null);

        expect(component.showDialogForgotPassword()).toBe(false);
        expect(component.isLoading).toBe(false);
        expect(alertService.alert()?.severity).toBe('success');
    });

    it('shows an error alert and stops loading when the request fails', () => {
        const alertService = TestBed.inject(AlertService);

        component.forgotPassword();

        httpMock.expectOne(r => r.url === `${ passwordResetTokenService.passwordResetTokenUrl }/forgot-password`)
            .flush('error', { status: 500, statusText: 'Server error' });

        expect(component.isLoading).toBe(false);
        expect(alertService.alert()?.severity).toBe('error');
    });

    it('closeModal() closes the dialog', () => {
        component.showDialogForgotPassword.set(true);

        component.closeModal();

        expect(component.showDialogForgotPassword()).toBe(false);
    });
});

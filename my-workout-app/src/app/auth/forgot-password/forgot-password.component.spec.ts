import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import emailjs from '@emailjs/browser';
import { ForgotPasswordComponent } from './forgot-password.component';
import { PasswordResetTokenService } from '../password-reset-token.service';
import { AlertService } from '../../services/alert.service';

vi.mock('@emailjs/browser', () => ({
    default: { send: vi.fn() }
}));

describe('ForgotPasswordComponent', () => {
    let fixture: ComponentFixture<ForgotPasswordComponent>;
    let component: ForgotPasswordComponent;
    let httpMock: HttpTestingController;
    let passwordResetTokenService: PasswordResetTokenService;

    beforeEach(() => {
        vi.clearAllMocks();

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

    it('sends the reset email and shows a success alert', async () => {
        const alertService = TestBed.inject(AlertService);
        vi.mocked(emailjs.send).mockResolvedValue({} as never);

        component.forgotPassword();

        httpMock.expectOne(r => r.url === `${ passwordResetTokenService.passwordResetTokenUrl }/forgot-password`)
            .flush({ link: 'https://my-workout.alexandre-vernet.fr/reset?token=abc' });

        await fixture.whenStable();

        expect(emailjs.send).toHaveBeenCalled();
        expect(component.showDialogForgotPassword()).toBe(false);
        expect(component.isLoading).toBe(false);
        expect(alertService.alert()?.severity).toBe('success');
    });

    it('shows an error alert when EmailJS fails to send', async () => {
        const alertService = TestBed.inject(AlertService);
        vi.mocked(emailjs.send).mockRejectedValue(new Error('EmailJS down'));

        component.forgotPassword();

        httpMock.expectOne(r => r.url === `${ passwordResetTokenService.passwordResetTokenUrl }/forgot-password`)
            .flush({ link: 'https://my-workout.alexandre-vernet.fr/reset?token=abc' });

        await fixture.whenStable();

        expect(component.isLoading).toBe(false);
        expect(alertService.alert()?.severity).toBe('error');
    });

    it('shows an error alert and stops loading when the token request itself fails', () => {
        const alertService = TestBed.inject(AlertService);

        component.forgotPassword();

        httpMock.expectOne(r => r.url === `${ passwordResetTokenService.passwordResetTokenUrl }/forgot-password`)
            .flush('error', { status: 500, statusText: 'Server error' });

        expect(component.isLoading).toBe(false);
        expect(alertService.alert()?.severity).toBe('error');
        expect(emailjs.send).not.toHaveBeenCalled();
    });

    it('closeModal() closes the dialog', () => {
        component.showDialogForgotPassword.set(true);

        component.closeModal();

        expect(component.showDialogForgotPassword()).toBe(false);
    });
});

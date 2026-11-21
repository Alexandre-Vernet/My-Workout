import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { ResetPasswordComponent } from './reset-password.component';
import { PasswordResetTokenService } from '../password-reset-token.service';

describe('ResetPasswordComponent', () => {
    let fixture: ComponentFixture<ResetPasswordComponent>;
    let component: ResetPasswordComponent;
    let httpMock: HttpTestingController;
    let passwordResetTokenService: PasswordResetTokenService;
    let router: Router;

    function createComponent() {
        TestBed.configureTestingModule({
            imports: [ResetPasswordComponent],
            providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
        });

        fixture = TestBed.createComponent(ResetPasswordComponent);
        fixture.componentRef.setInput('token', 'abc-token');
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        passwordResetTokenService = TestBed.inject(PasswordResetTokenService);
        router = TestBed.inject(Router);
    }

    afterEach(() => {
        httpMock.verify();
    });

    it('checks the token validity on init and does nothing when it is valid', () => {
        createComponent();
        const navigateSpy = vi.spyOn(router, 'navigate');

        fixture.detectChanges();
        httpMock.expectOne(r => r.url === `${ passwordResetTokenService.passwordResetTokenUrl }/valid`).flush(true);

        expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('redirects to login when the token is invalid', () => {
        createComponent();
        const navigateSpy = vi.spyOn(router, 'navigate');

        fixture.detectChanges();
        httpMock.expectOne(r => r.url === `${ passwordResetTokenService.passwordResetTokenUrl }/valid`).flush(false);

        expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
    });

    it('redirects to login when checking the token fails', () => {
        createComponent();
        const navigateSpy = vi.spyOn(router, 'navigate');

        fixture.detectChanges();
        httpMock.expectOne(r => r.url === `${ passwordResetTokenService.passwordResetTokenUrl }/valid`)
            .flush('error', { status: 500, statusText: 'Server error' });

        expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
    });

    describe('submitForm()', () => {
        beforeEach(() => {
            createComponent();
            fixture.detectChanges();
            httpMock.expectOne(r => r.url === `${ passwordResetTokenService.passwordResetTokenUrl }/valid`).flush(true);
        });

        it('rejects mismatched passwords without calling the API', () => {
            component.formResetPassword.setValue({ newPassword: 'secret1', confirmPassword: 'secret2' });

            component['submitForm']();

            httpMock.expectNone(r => r.url === `${ passwordResetTokenService.passwordResetTokenUrl }/reset-password`);
            expect(component.formResetPassword.hasError('error')).toBe(true);
        });

        it('resets the password and redirects to login on success', () => {
            component.formResetPassword.setValue({ newPassword: 'secret1', confirmPassword: 'secret1' });
            const navigateSpy = vi.spyOn(router, 'navigate');

            component['submitForm']();

            const req = httpMock.expectOne(`${ passwordResetTokenService.passwordResetTokenUrl }/reset-password`);
            expect(req.request.body).toEqual({ token: 'abc-token', password: 'secret1' });
            req.flush(null);

            expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
        });

        it('does nothing when the form is invalid', () => {
            component.formResetPassword.setValue({ newPassword: '', confirmPassword: '' });

            component['submitForm']();

            httpMock.expectNone(r => r.url === `${ passwordResetTokenService.passwordResetTokenUrl }/reset-password`);
        });

        it('shows the server error message in the template when the reset fails', () => {
            component.formResetPassword.setValue({ newPassword: 'secret1', confirmPassword: 'secret1' });

            component['submitForm']();

            httpMock.expectOne(`${ passwordResetTokenService.passwordResetTokenUrl }/reset-password`)
                .flush({ message: 'Le lien a expiré' }, { status: 400, statusText: 'Bad Request' });
            fixture.detectChanges();

            expect(fixture.nativeElement.textContent).toContain('Le lien a expiré');
        });
    });
});

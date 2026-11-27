import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PasswordResetTokenService } from './password-reset-token.service';

describe('PasswordResetTokenService', () => {
    let service: PasswordResetTokenService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()]
        });

        service = TestBed.inject(PasswordResetTokenService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('forgotPassword() sends the email as a query param', () => {
        service.forgotPassword('alex@example.com').subscribe();

        const req = httpMock.expectOne(r => r.url === `${ service.passwordResetTokenUrl }/forgot-password`);
        expect(req.request.params.get('email')).toBe('alex@example.com');
        req.flush(null);
    });

    it('isTokenValid() sends the token as a query param', () => {
        let result: boolean | undefined;
        service.isTokenValid('abc').subscribe(res => result = res);

        const req = httpMock.expectOne(r => r.url === `${ service.passwordResetTokenUrl }/valid`);
        expect(req.request.params.get('token')).toBe('abc');
        req.flush(true);

        expect(result).toBe(true);
    });

    it('resetPassword() POSTs the token and the new password', () => {
        service.resetPassword('abc', 'new-secret').subscribe();

        const req = httpMock.expectOne(`${ service.passwordResetTokenUrl }/reset-password`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ token: 'abc', password: 'new-secret' });
        req.flush(null);
    });
});

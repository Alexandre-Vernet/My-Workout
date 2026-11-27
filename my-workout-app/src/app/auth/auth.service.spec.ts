import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { User } from '../../interfaces/User';
import { LoginRequest } from '../../interfaces/LoginRequest';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        localStorage.clear();

        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()]
        });

        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('has no token and is not authenticated before any login', () => {
        expect(service.hasToken()).toBe(false);
        expect(service.getAccessToken()).toBeNull();
    });

    it('stores the access and refresh tokens on login', () => {
        service.login(new LoginRequest('alex@example.com', 'secret')).subscribe();

        httpMock.expectOne(`${ service.authUrl }/login`)
            .flush({ accessToken: 'access-123', refreshToken: 'refresh-456' });

        expect(service.getAccessToken()).toBe('access-123');
        expect(localStorage.getItem('refresh-token')).toBe('refresh-456');
        expect(service.hasToken()).toBe(true);
    });

    it('caches getCurrentUser() so a single HTTP call serves every caller', () => {
        const user: User = { id: 1, email: 'alex@example.com' };

        service.getCurrentUser().subscribe();
        service.getCurrentUser().subscribe();

        httpMock.expectOne(`${ service.authUrl }/me`).flush(user);
        httpMock.expectNone(`${ service.authUrl }/me`);
    });

    it('drops the cached user after login so a fresh /me call is made next time', () => {
        service.getCurrentUser().subscribe();
        httpMock.expectOne(`${ service.authUrl }/me`).flush({ id: 1, email: 'old@example.com' } satisfies User);

        service.login(new LoginRequest('new@example.com', 'secret')).subscribe();
        httpMock.expectOne(`${ service.authUrl }/login`).flush({ accessToken: 'a', refreshToken: 'r' });

        service.getCurrentUser().subscribe();
        httpMock.expectOne(`${ service.authUrl }/me`).flush({ id: 2, email: 'new@example.com' } satisfies User);
    });

    it('refresh() resolves to null without an HTTP call when there is no refresh token', () => {
        const results: unknown[] = [];
        service.refresh().subscribe(result => results.push(result));

        httpMock.expectNone(`${ service.authUrl }/refresh`);
        expect(results).toEqual([null]);
    });

    it('refresh() stores the new tokens when a refresh token is present', () => {
        localStorage.setItem('refresh-token', 'refresh-456');

        service.refresh().subscribe();

        httpMock.expectOne(`${ service.authUrl }/refresh`)
            .flush({ accessToken: 'access-789', refreshToken: 'refresh-999' });

        expect(service.getAccessToken()).toBe('access-789');
        expect(localStorage.getItem('refresh-token')).toBe('refresh-999');
    });

    it('signOut() clears both tokens and the cached user', () => {
        localStorage.setItem('access-token', 'a');
        localStorage.setItem('refresh-token', 'r');

        service.signOut();

        expect(service.hasToken()).toBe(false);
        expect(localStorage.getItem('refresh-token')).toBeNull();
    });

    it('updateUser() patches the current account without an id in the URL, then signs the user out', () => {
        localStorage.setItem('access-token', 'a');
        service.updateUser({ email: 'new@example.com' }).subscribe();

        const req = httpMock.expectOne(service.authUrl);
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toEqual({ email: 'new@example.com' });
        req.flush({ id: 1, email: 'new@example.com' } satisfies User);

        expect(service.hasToken()).toBe(false);
    });
});

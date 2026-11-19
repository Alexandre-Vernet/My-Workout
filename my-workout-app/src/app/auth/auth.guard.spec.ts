import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router, UrlTree } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AlertService } from '../services/alert.service';

describe('authGuard', () => {
    let httpMock: HttpTestingController;
    let router: Router;
    let authService: AuthService;

    beforeEach(() => {
        localStorage.clear();

        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()]
        });

        httpMock = TestBed.inject(HttpTestingController);
        router = TestBed.inject(Router);
        authService = TestBed.inject(AuthService);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('redirects to login without any HTTP call when there is no token', () => {
        const result = TestBed.runInInjectionContext(() => authGuard());

        expect(result).toBeInstanceOf(UrlTree);
        httpMock.expectNone(`${ authService.authUrl }/me`);
    });

    it('surfaces an error alert when there is no token', () => {
        const alertService = TestBed.inject(AlertService);

        TestBed.runInInjectionContext(() => authGuard());

        expect(alertService.alert()?.severity).toBe('error');
    });

    it('allows navigation when the token is valid and /auth/me succeeds', async () => {
        localStorage.setItem('access-token', 'a');

        const result = TestBed.runInInjectionContext(() => authGuard()) as Observable<boolean | UrlTree>;
        const resultPromise = firstValueFrom(result);
        httpMock.expectOne(`${ authService.authUrl }/me`).flush({ id: 1, email: 'alex@example.com' });

        expect(await resultPromise).toBe(true);
    });

    it('redirects to login when the token is present but /auth/me fails', async () => {
        localStorage.setItem('access-token', 'a');
        const createUrlTreeSpy = vi.spyOn(router, 'createUrlTree');

        const result = TestBed.runInInjectionContext(() => authGuard()) as Observable<boolean | UrlTree>;
        const resultPromise = firstValueFrom(result);
        httpMock.expectOne(`${ authService.authUrl }/me`).flush('unauthorized', { status: 401, statusText: 'Unauthorized' });

        expect(await resultPromise).toBeInstanceOf(UrlTree);
        expect(createUrlTreeSpy).toHaveBeenCalledWith(['/auth/login']);
    });
});

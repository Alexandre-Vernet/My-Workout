import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UrlTree } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { defaultHomePageGuard } from './default-home-page.guard';
import { AuthService } from './auth.service';
import { MenuUrls } from '../shared/menu-urls';

describe('defaultHomePageGuard', () => {
    let httpMock: HttpTestingController;
    let authService: AuthService;

    beforeEach(() => {
        localStorage.clear();

        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()]
        });

        httpMock = TestBed.inject(HttpTestingController);
        authService = TestBed.inject(AuthService);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('redirects to the library page without any HTTP call when logged out', () => {
        const result = TestBed.runInInjectionContext(() => defaultHomePageGuard());

        expect(result).toBeInstanceOf(UrlTree);
        httpMock.expectNone(`${ authService.authUrl }/me`);
    });

    it('redirects to the workout page when logged in', async () => {
        localStorage.setItem('access-token', 'a');

        const result = TestBed.runInInjectionContext(() => defaultHomePageGuard()) as Observable<UrlTree>;
        const resultPromise = firstValueFrom(result);
        httpMock.expectOne(`${ authService.authUrl }/me`).flush({ id: 1, email: 'alex@example.com' });

        const urlTree = await resultPromise;
        expect(urlTree.toString()).toContain(MenuUrls.workout);
    });

    it('falls back to the library page when the token is stale', async () => {
        localStorage.setItem('access-token', 'a');

        const result = TestBed.runInInjectionContext(() => defaultHomePageGuard()) as Observable<UrlTree>;
        const resultPromise = firstValueFrom(result);
        httpMock.expectOne(`${ authService.authUrl }/me`).flush('unauthorized', { status: 401, statusText: 'Unauthorized' });

        const urlTree = await resultPromise;
        expect(urlTree.toString()).toContain(MenuUrls.library);
    });
});

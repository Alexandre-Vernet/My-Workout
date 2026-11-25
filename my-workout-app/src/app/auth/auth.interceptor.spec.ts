import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { AlertService } from '../services/alert.service';
import { environment } from '../../environments/environment';

describe('authInterceptor', () => {
    let http: HttpClient;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        localStorage.clear();

        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([authInterceptor])),
                provideHttpClientTesting()
            ]
        });

        http = TestBed.inject(HttpClient);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('attaches the access token as a Bearer header when one is present', () => {
        localStorage.setItem('access-token', 'access-123');

        http.get('/api/exercises').subscribe();

        const request = httpMock.expectOne('/api/exercises');
        expect(request.request.headers.get('Authorization')).toBe('Bearer access-123');
        request.flush([]);
    });

    it('sends no Authorization header when there is no access token', () => {
        http.get('/api/exercises').subscribe();

        const request = httpMock.expectOne('/api/exercises');
        expect(request.request.headers.has('Authorization')).toBe(false);
        request.flush([]);
    });

    it('clears the current alert on a successful response', () => {
        const alertService = TestBed.inject(AlertService);
        alertService.show({ severity: 'error', message: 'previous error' });

        http.get('/api/exercises').subscribe();
        httpMock.expectOne('/api/exercises').flush([]);

        expect(alertService.alert()).toBeNull();
    });

    it('refreshes the token and retries the request on a 401', () => {
        localStorage.setItem('access-token', 'expired-access');
        localStorage.setItem('refresh-token', 'refresh-456');

        let result: unknown;
        http.get('/api/exercises').subscribe(res => result = res);

        httpMock.expectOne('/api/exercises').flush('unauthorized', { status: 401, statusText: 'Unauthorized' });

        httpMock.expectOne(`${ environment.authUrl() }/refresh`)
            .flush({ accessToken: 'new-access', refreshToken: 'new-refresh' });

        const retriedRequest = httpMock.expectOne('/api/exercises');
        expect(retriedRequest.request.headers.get('Authorization')).toBe('Bearer new-access');
        retriedRequest.flush(['exercise']);

        expect(result).toEqual(['exercise']);
    });

    it('fails with an Unauthorized error and clears the stored tokens on a 401 when there is no refresh token to try', () => {
        localStorage.setItem('access-token', 'expired-access');

        let error: unknown;
        http.get('/api/exercises').subscribe({ error: err => error = err });

        httpMock.expectOne('/api/exercises').flush('unauthorized', { status: 401, statusText: 'Unauthorized' });
        httpMock.expectNone(`${ environment.authUrl() }/refresh`);

        expect((error as Error).message).toBe('Unauthorized');
        expect(localStorage.getItem('access-token')).toBeNull();
    });

    it('fails with an Unauthorized error and clears the stored tokens when the refresh request itself fails', () => {
        localStorage.setItem('access-token', 'expired-access');
        localStorage.setItem('refresh-token', 'expired-refresh');

        let error: unknown;
        http.get('/api/exercises').subscribe({ error: err => error = err });

        httpMock.expectOne('/api/exercises').flush('unauthorized', { status: 401, statusText: 'Unauthorized' });
        httpMock.expectOne(`${ environment.authUrl() }/refresh`)
            .flush('invalid token', { status: 401, statusText: 'Unauthorized' });

        expect((error as Error).message).toBe('Unauthorized');
        expect(localStorage.getItem('access-token')).toBeNull();
        expect(localStorage.getItem('refresh-token')).toBeNull();
    });
});

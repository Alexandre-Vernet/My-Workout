import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';

describe('LoginComponent', () => {
    let fixture: ComponentFixture<LoginComponent>;
    let component: LoginComponent;
    let httpMock: HttpTestingController;
    let authService: AuthService;

    beforeEach(() => {
        localStorage.clear();

        TestBed.configureTestingModule({
            imports: [LoginComponent],
            providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
        });

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        authService = TestBed.inject(AuthService);

        component.formLogin.setValue({ email: 'alex@example.com', password: 'secret1' });
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('trims the email and logs in', () => {
        component.formLogin.controls.email.setValue('  alex@example.com  ');

        component.signIn();

        const req = httpMock.expectOne(`${ authService.authUrl }/login`);
        expect(req.request.body).toEqual({ email: 'alex@example.com', password: 'secret1' });
        req.flush({ accessToken: 'a', refreshToken: 'r' });
    });

    it('navigates home after a successful login', () => {
        const router = TestBed.inject(Router);
        const navigateSpy = vi.spyOn(router, 'navigateByUrl');

        component.signIn();
        httpMock.expectOne(`${ authService.authUrl }/login`).flush({ accessToken: 'a', refreshToken: 'r' });

        expect(navigateSpy).toHaveBeenCalledWith('/');
    });

    it('flags bad credentials on a failed login', () => {
        component.signIn();

        httpMock.expectOne(`${ authService.authUrl }/login`)
            .flush('unauthorized', { status: 401, statusText: 'Unauthorized' });

        expect(component.formLogin.hasError('badCredential')).toBe(true);
    });
});

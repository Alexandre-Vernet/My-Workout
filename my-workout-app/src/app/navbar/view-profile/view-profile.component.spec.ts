import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ViewProfileComponent } from './view-profile.component';
import { AuthService } from '../../auth/auth.service';
import { AlertService } from '../../services/alert.service';

describe('ViewProfileComponent', () => {
    let fixture: ComponentFixture<ViewProfileComponent>;
    let component: ViewProfileComponent;
    let httpMock: HttpTestingController;
    let authService: AuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ViewProfileComponent],
            providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
        });

        fixture = TestBed.createComponent(ViewProfileComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        authService = TestBed.inject(AuthService);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('loads the current user on init', () => {
        fixture.detectChanges();

        httpMock.expectOne(`${ authService.authUrl }/me`).flush({ id: 1, email: 'alex@example.com', admin: true });

        expect(component['user']()?.email).toBe('alex@example.com');
    });

    it('displayAlert() forwards the alert to the AlertService', () => {
        const alertService = TestBed.inject(AlertService);
        fixture.detectChanges();
        httpMock.expectOne(`${ authService.authUrl }/me`).flush({ id: 1, email: 'alex@example.com' });

        component.displayAlert({ severity: 'success', message: 'Saved' });

        expect(alertService.alert()).toEqual({ severity: 'success', message: 'Saved' });
    });
});

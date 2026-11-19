import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { AccountActionsComponent } from './account-actions.component';
import { AuthService } from '../../../auth/auth.service';
import { MenuUrls } from '../../../shared/menu-urls';

describe('AccountActionsComponent', () => {
    let fixture: ComponentFixture<AccountActionsComponent>;
    let component: AccountActionsComponent;
    let httpMock: HttpTestingController;
    let authService: AuthService;
    let confirmationService: ConfirmationService;
    let router: Router;

    beforeEach(() => {
        localStorage.clear();

        TestBed.configureTestingModule({
            imports: [AccountActionsComponent],
            providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
        });

        fixture = TestBed.createComponent(AccountActionsComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        authService = TestBed.inject(AuthService);
        confirmationService = fixture.debugElement.injector.get(ConfirmationService);
        router = TestBed.inject(Router);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('signOut() clears the session and navigates to the library', () => {
        localStorage.setItem('access-token', 'a');
        const navigateSpy = vi.spyOn(router, 'navigate');

        component.signOut();

        expect(authService.hasToken()).toBe(false);
        expect(navigateSpy).toHaveBeenCalledWith([MenuUrls.library]);
    });

    it('openDialogConfirmDeleteAccount() asks for confirmation before deleting', () => {
        const confirmSpy = vi.spyOn(confirmationService, 'confirm');

        component.openDialogConfirmDeleteAccount();

        expect(confirmSpy).toHaveBeenCalledOnce();
        httpMock.expectNone(authService.authUrl);
    });

    describe('deleteAccount()', () => {
        it('signs the user out and emits a success alert', () => {
            localStorage.setItem('access-token', 'a');
            let emitted: unknown;
            component.showAlert.subscribe(alert => emitted = alert);

            component.deleteAccount();

            httpMock.expectOne(authService.authUrl).flush(null);

            expect(emitted).toEqual({ message: 'Votre compte a bien été supprimé', severity: 'success' });
            expect(authService.hasToken()).toBe(false);
        });

        it('emits an error alert when the deletion fails', () => {
            let emitted: unknown;
            component.showAlert.subscribe(alert => emitted = alert);

            component.deleteAccount();

            httpMock.expectOne(authService.authUrl).flush('error', { status: 500, statusText: 'Server error' });

            expect(emitted).toEqual(expect.objectContaining({ severity: 'error' }));
        });
    });
});

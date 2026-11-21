import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { AccountActionsComponent } from './account-actions.component';
import { AuthService } from '../../../auth/auth.service';
import { MenuUrls } from '../../../shared/menu-urls';

@Component({ template: '', standalone: true })
class StubComponent {
}

describe('AccountActionsComponent', () => {
    let fixture: ComponentFixture<AccountActionsComponent>;
    let component: AccountActionsComponent;
    let httpMock: HttpTestingController;
    let authService: AuthService;
    let router: Router;

    beforeEach(() => {
        localStorage.clear();

        TestBed.configureTestingModule({
            imports: [AccountActionsComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([{ path: '**', component: StubComponent }])
            ]
        });

        fixture = TestBed.createComponent(AccountActionsComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        authService = TestBed.inject(AuthService);
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

    it('openDialogConfirmDeleteAccount() opens the confirmation dialog without deleting yet', () => {
        component.openDialogConfirmDeleteAccount();

        expect(component['confirmDeleteOpen']()).toBe(true);
        httpMock.expectNone(authService.authUrl);
    });

    it('onCancelDelete() closes the dialog without deleting', () => {
        component.openDialogConfirmDeleteAccount();

        component.onCancelDelete();

        expect(component['confirmDeleteOpen']()).toBe(false);
        httpMock.expectNone(authService.authUrl);
    });

    it('onConfirmDelete() closes the dialog and deletes the account', () => {
        component.openDialogConfirmDeleteAccount();

        component.onConfirmDelete();

        expect(component['confirmDeleteOpen']()).toBe(false);
        httpMock.expectOne(authService.authUrl).flush(null);
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

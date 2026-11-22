import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ListGymComponent } from './list-gym.component';
import { GymService } from '../../../services/gym.service';
import { AlertService } from '../../../services/alert.service';
import { Gym } from '../../../../interfaces/gym';

describe('ListGymComponent', () => {
    let fixture: ComponentFixture<ListGymComponent>;
    let component: ListGymComponent;
    let httpMock: HttpTestingController;
    let gymService: GymService;

    const user = { id: 1, email: 'a@b.com' };
    const gyms: Gym[] = [
        { id: 1, name: 'Basic Fit', user },
        { id: 2, name: 'Fitness Park', user }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ListGymComponent],
            providers: [provideHttpClient(), provideHttpClientTesting()]
        });

        fixture = TestBed.createComponent(ListGymComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        gymService = TestBed.inject(GymService);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('initial load', () => {
        it('shows the loading skeleton until the gyms arrive, then shows the list', () => {
            fixture.detectChanges();

            expect(component['loading']()).toBe(true);

            httpMock.expectOne(gymService.gymUrl).flush(gyms);

            expect(component['loading']()).toBe(false);
            expect(component['gyms']()).toEqual(gyms);
        });

        it('keeps an empty list when there is no gym', () => {
            fixture.detectChanges();

            httpMock.expectOne(gymService.gymUrl).flush([]);

            expect(component['loading']()).toBe(false);
            expect(component['gyms']()).toEqual([]);
        });

        it('stops showing the loading skeleton and shows an error alert when the load fails', () => {
            fixture.detectChanges();
            const alertService = TestBed.inject(AlertService);

            httpMock.expectOne(gymService.gymUrl).flush('error', { status: 500, statusText: 'Server error' });

            expect(component['loading']()).toBe(false);
            expect(alertService.alert()?.severity).toBe('error');
        });
    });

    describe('add', () => {
        beforeEach(() => {
            fixture.detectChanges();
            httpMock.expectOne(gymService.gymUrl).flush(gyms);
        });

        it('openAddForm() opens the form with an empty name', () => {
            component['openRenameForm'](gyms[0]);

            component['openAddForm']();

            expect(component['formOpen']()).toBe(true);
            expect(component['editingGym']()).toBeNull();
            expect(component['formGroup'].controls.name.value).toBe('');
        });

        it('adds the gym to the list and closes the form on success', () => {
            const alertService = TestBed.inject(AlertService);
            component['openAddForm']();
            component['formGroup'].controls.name.setValue('New gym');

            component['submitForm']();

            const req = httpMock.expectOne(gymService.gymUrl);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual({ name: 'New gym' });
            req.flush({ id: 3, name: 'New gym', user });

            expect(component['gyms']()).toEqual([...gyms, { id: 3, name: 'New gym', user }]);
            expect(component['formOpen']()).toBe(false);
            expect(alertService.alert()?.severity).toBe('success');
        });

        it('sets a field error on the name control when the gym name is a duplicate (409 DUPLICATE_GYM)', () => {
            component['openAddForm']();
            component['formGroup'].controls.name.setValue('Basic Fit');

            component['submitForm']();

            httpMock.expectOne(gymService.gymUrl).flush(
                { message: 'Ce nom de salle existe déjà', errorCode: 'DUPLICATE_GYM', type: 'BUSINESS' },
                { status: 409, statusText: 'Conflict' }
            );

            expect(component['formGroup'].controls.name.hasError('duplicateGym')).toBe(true);
            expect(component['formOpen']()).toBe(true);
            expect(component['gyms']()).toEqual(gyms);
        });

        it('does not call the API when the name is blank', () => {
            component['openAddForm']();
            component['formGroup'].controls.name.setValue('   ');

            component['submitForm']();

            httpMock.expectNone(gymService.gymUrl);
        });
    });

    describe('rename', () => {
        beforeEach(() => {
            fixture.detectChanges();
            httpMock.expectOne(gymService.gymUrl).flush(gyms);
        });

        it('openRenameForm() opens the form pre-filled with the gym name', () => {
            component['openRenameForm'](gyms[0]);

            expect(component['formOpen']()).toBe(true);
            expect(component['editingGym']()).toEqual(gyms[0]);
            expect(component['formGroup'].controls.name.value).toBe('Basic Fit');
        });

        it('updates the gym in the list and closes the form on success', () => {
            const alertService = TestBed.inject(AlertService);
            component['openRenameForm'](gyms[0]);
            component['formGroup'].controls.name.setValue('Renamed gym');

            component['submitForm']();

            const req = httpMock.expectOne(`${ gymService.gymUrl }/1`);
            expect(req.request.method).toBe('PATCH');
            expect(req.request.body).toEqual({ name: 'Renamed gym' });
            req.flush({ id: 1, name: 'Renamed gym', user });

            expect(component['gyms']()).toEqual([{ id: 1, name: 'Renamed gym', user }, gyms[1]]);
            expect(component['formOpen']()).toBe(false);
            expect(alertService.alert()?.severity).toBe('success');
        });

        it('shows an error alert when the gym cannot be found (404 GYM_NOT_FOUND)', () => {
            const alertService = TestBed.inject(AlertService);
            component['openRenameForm'](gyms[0]);
            component['formGroup'].controls.name.setValue('Renamed gym');

            component['submitForm']();

            httpMock.expectOne(`${ gymService.gymUrl }/1`).flush(
                { message: 'Cette salle n\'existe pas', errorCode: 'GYM_NOT_FOUND', type: 'BUSINESS' },
                { status: 404, statusText: 'Not Found' }
            );

            expect(alertService.alert()?.severity).toBe('error');
            expect(alertService.alert()?.message).toBe('Cette salle n\'existe pas');
        });
    });

    describe('delete', () => {
        beforeEach(() => {
            vi.useFakeTimers();
            fixture.detectChanges();
            httpMock.expectOne(gymService.gymUrl).flush(gyms);
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('openDeleteConfirm() sets the pending deletion without calling the API', () => {
            component['openDeleteConfirm'](gyms[0]);

            expect(component['pendingDeletion']()).toEqual(gyms[0]);
            httpMock.expectNone(`${ gymService.gymUrl }/1`);
        });

        it('cancelDelete() clears the pending deletion without calling the API', () => {
            component['openDeleteConfirm'](gyms[0]);

            component['cancelDelete']();

            expect(component['pendingDeletion']()).toBeNull();
            httpMock.expectNone(`${ gymService.gymUrl }/1`);
        });

        it('confirmDelete() deletes the gym and removes it from the list', () => {
            const alertService = TestBed.inject(AlertService);
            component['openDeleteConfirm'](gyms[0]);

            component['confirmDelete']();

            expect(component['pendingDeletion']()).toBeNull();
            httpMock.expectOne(`${ gymService.gymUrl }/1`).flush(null);

            // The card animates out before actually leaving the signal.
            expect(component['removingGymId']()).toBe(1);
            expect(component['gyms']()).toEqual(gyms);
            expect(alertService.alert()?.severity).toBe('success');

            vi.advanceTimersByTime(300);

            expect(component['gyms']()).toEqual([gyms[1]]);
            expect(component['removingGymId']()).toBeNull();
        });

        it('shows an error alert and keeps the gym in the list when the deletion fails', () => {
            const alertService = TestBed.inject(AlertService);
            component['openDeleteConfirm'](gyms[0]);

            component['confirmDelete']();

            httpMock.expectOne(`${ gymService.gymUrl }/1`)
                .flush('error', { status: 500, statusText: 'Server error' });

            expect(alertService.alert()?.severity).toBe('error');
            expect(component['gyms']()).toEqual(gyms);
        });
    });
});

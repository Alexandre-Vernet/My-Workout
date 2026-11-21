import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CalendarComponent } from './calendar.component';
import { WorkoutService } from '../../services/workout.service';
import { AlertService } from '../../services/alert.service';
import { Workout } from '../../../interfaces/Workout';

describe('CalendarComponent', () => {
    let fixture: ComponentFixture<CalendarComponent>;
    let component: CalendarComponent;
    let httpMock: HttpTestingController;
    let workoutService: WorkoutService;

    const workouts: Workout[] = [
        { id: 1, date: new Date(2026, 0, 5), muscleGroup: { id: 1, name: 'pectoraux' } }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CalendarComponent],
            providers: [provideHttpClient(), provideHttpClientTesting()]
        });

        fixture = TestBed.createComponent(CalendarComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        workoutService = TestBed.inject(WorkoutService);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('shows the loading skeleton until the month data arrives', () => {
        fixture.detectChanges();

        expect(component['loading']()).toBe(true);

        httpMock.expectOne(r => r.url === `${ workoutService.workoutUrl }/date`).flush(workouts);

        expect(component['loading']()).toBe(false);
        expect(component['workouts']).toEqual(workouts);
    });

    it('stops showing the loading skeleton when the month data fails to load', () => {
        fixture.detectChanges();
        const alertService = TestBed.inject(AlertService);

        httpMock.expectOne(r => r.url === `${ workoutService.workoutUrl }/date`)
            .flush('error', { status: 500, statusText: 'Server error' });

        expect(component['loading']()).toBe(false);
        expect(alertService.alert()?.severity).toBe('error');
    });

    it('does not show the loading skeleton again when navigating to another month', () => {
        fixture.detectChanges();
        httpMock.expectOne(r => r.url === `${ workoutService.workoutUrl }/date`).flush(workouts);

        component['nextMonth']();

        expect(component['loading']()).toBe(false);
        httpMock.expectOne(r => r.url === `${ workoutService.workoutUrl }/date`).flush([]);
    });

    describe('openModalDeleteWorkout / confirmDeleteWorkout / cancelDeleteWorkout', () => {
        beforeEach(() => {
            fixture.detectChanges();
            httpMock.expectOne(r => r.url === `${ workoutService.workoutUrl }/date`).flush(workouts);
        });

        it('opens the confirmation with the formatted message and closes the day sheet', () => {
            component['sheetOpen'].set(true);

            component['openModalDeleteWorkout'](1, 'Pectoraux', new Date(2026, 0, 5));

            expect(component['sheetOpen']()).toBe(false);
            expect(component['pendingWorkoutDeletion']()?.message)
                .toContain('Pectoraux');
        });

        it('cancelDeleteWorkout() clears the pending deletion without calling the API', () => {
            component['openModalDeleteWorkout'](1, 'Pectoraux', new Date(2026, 0, 5));

            component['cancelDeleteWorkout']();

            expect(component['pendingWorkoutDeletion']()).toBeNull();
            httpMock.expectNone(workoutService.workoutUrl);
        });

        it('confirmDeleteWorkout() deletes the workout, refreshes the calendar and shows a success alert', () => {
            const alertService = TestBed.inject(AlertService);
            component['openModalDeleteWorkout'](1, 'Pectoraux', new Date(2026, 0, 5));

            component['confirmDeleteWorkout']();

            httpMock.expectOne(`${ workoutService.workoutUrl }/1`).flush(null);

            expect(component['pendingWorkoutDeletion']()).toBeNull();
            expect(component['workouts']).toEqual([]);
            expect(alertService.alert()?.severity).toBe('success');
        });

        it('confirmDeleteWorkout() shows an error alert when the deletion fails', () => {
            const alertService = TestBed.inject(AlertService);
            component['openModalDeleteWorkout'](1, 'Pectoraux', new Date(2026, 0, 5));

            component['confirmDeleteWorkout']();

            httpMock.expectOne(`${ workoutService.workoutUrl }/1`)
                .flush('error', { status: 500, statusText: 'Server error' });

            expect(alertService.alert()?.severity).toBe('error');
        });
    });

    describe('monthSessionDays / weekdayLabel / dayGroupsLabel', () => {
        beforeEach(() => {
            component['displayedMonth'] = new Date(2026, 0, 1);
        });

        it('lists days with a session, most recent first', () => {
            fixture.detectChanges();
            httpMock.expectOne(r => r.url === `${ workoutService.workoutUrl }/date`).flush([
                { id: 1, date: new Date(2026, 0, 5), muscleGroup: { id: 1, name: 'pectoraux' } },
                { id: 2, date: new Date(2026, 0, 20), muscleGroup: { id: 2, name: 'jambes' } }
            ]);

            expect(component['monthSessionDays'].map(d => d.day)).toEqual([20, 5]);
        });

        it('excludes days fully filtered out by the active muscle group', () => {
            fixture.detectChanges();
            httpMock.expectOne(r => r.url === `${ workoutService.workoutUrl }/date`).flush([
                { id: 1, date: new Date(2026, 0, 5), muscleGroup: { id: 1, name: 'pectoraux' } },
                { id: 2, date: new Date(2026, 0, 20), muscleGroup: { id: 2, name: 'jambes' } }
            ]);

            component['filterByMuscleGroup']({ id: 2, name: 'jambes' });

            expect(component['monthSessionDays'].map(d => d.day)).toEqual([20]);
        });

        it('formats the weekday for a given date', () => {
            expect(component['weekdayLabel'](new Date(2026, 0, 5))).toBe('Lun');
        });

        it('joins unique muscle group labels for a day, respecting the active filter', () => {
            fixture.detectChanges();
            httpMock.expectOne(r => r.url === `${ workoutService.workoutUrl }/date`).flush([
                { id: 1, date: new Date(2026, 0, 5), muscleGroup: { id: 1, name: 'pectoraux' } },
                { id: 2, date: new Date(2026, 0, 5), muscleGroup: { id: 2, name: 'jambes' } }
            ]);
            const day = component['monthSessionDays'][0];

            expect(component['dayGroupsLabel'](day)).toBe('Pecs · Jambes');

            component['filterByMuscleGroup']({ id: 2, name: 'jambes' });

            expect(component['dayGroupsLabel'](component['monthSessionDays'][0])).toBe('Jambes');
        });
    });
});

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ConfirmationService } from 'primeng/api';
import { EventClickArg, EventMountArg } from '@fullcalendar/core';
import { DateClickArg } from '@fullcalendar/interaction';
import { CalendarComponent } from './calendar.component';
import { WorkoutService } from '../../services/workout.service';
import { ExerciseService } from '../../services/exercise.service';
import { AlertService } from '../../services/alert.service';
import { Workout } from '../../../interfaces/Workout';
import { Exercise } from '../../../interfaces/Exercise';

// CalendarComponent wraps the real FullCalendar library, which does not tear down cleanly under
// jsdom. We instantiate the class directly (no template/view) to unit-test its own logic in isolation.
describe('CalendarComponent', () => {
    let component: CalendarComponent;
    let httpMock: HttpTestingController;
    let confirmationService: ConfirmationService;

    const pectoraux: Workout = { id: 1, date: new Date(2026, 0, 1), muscleGroup: { id: 1, name: 'pectoraux' } };
    const biceps: Workout = { id: 2, date: new Date(2026, 0, 2), muscleGroup: { id: 6, name: 'biceps' } };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting(), ConfirmationService]
        });

        component = TestBed.runInInjectionContext(() => new CalendarComponent());
        httpMock = TestBed.inject(HttpTestingController);
        confirmationService = TestBed.inject(ConfirmationService);

        component.workouts = [pectoraux, biceps];
        component.filterWorkouts = [pectoraux, biceps];
        component.calendarComponent = { getApi: () => ({ refetchEvents: vi.fn() }) } as never;
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('filterByMuscleGroup()', () => {
        it('filters the workouts down to the selected muscle group', () => {
            component.filterByMuscleGroup({ id: 1, name: 'pectoraux' });

            expect(component.filterWorkouts).toEqual([pectoraux]);
            expect(component.activeFilter?.name).toBe('pectoraux');
        });

        it('clicking the already-active muscle group clears the filter', () => {
            component.filterByMuscleGroup({ id: 1, name: 'pectoraux' });

            component.filterByMuscleGroup({ id: 1, name: 'pectoraux' });

            expect(component.filterWorkouts).toEqual([pectoraux, biceps]);
            expect(component.activeFilter).toBeNull();
        });
    });

    describe('openModalDeleteWorkout()', () => {
        it('removes the workout and shows a success alert once the deletion is confirmed', () => {
            const alertService = TestBed.inject(AlertService);
            const workoutService = TestBed.inject(WorkoutService);
            const confirmSpy = vi.spyOn(confirmationService, 'confirm');

            component.openModalDeleteWorkout(1, 'pectoraux', pectoraux.date);
            const { accept } = confirmSpy.mock.calls[0][0];
            accept!();

            httpMock.expectOne(`${ workoutService.workoutUrl }/1`).flush(null);

            expect(component.workouts).toEqual([biceps]);
            expect(alertService.alert()?.severity).toBe('success');
        });

        it('shows an error alert when the deletion fails', () => {
            const alertService = TestBed.inject(AlertService);
            const workoutService = TestBed.inject(WorkoutService);
            const confirmSpy = vi.spyOn(confirmationService, 'confirm');

            component.openModalDeleteWorkout(1, 'pectoraux', pectoraux.date);
            const { accept } = confirmSpy.mock.calls[0][0];
            accept!();

            httpMock.expectOne(`${ workoutService.workoutUrl }/1`)
                .flush('error', { status: 500, statusText: 'Server error' });

            expect(alertService.alert()?.severity).toBe('error');
        });
    });

    describe('createdWorkout()', () => {
        it('adds the workout to the list and shows a success alert naming the exercise', () => {
            const alertService = TestBed.inject(AlertService);
            const newWorkout: Workout = {
                id: 3,
                date: new Date(),
                histories: [{ exercise: { name: 'Running' } }]
            };

            component.createdWorkout(newWorkout);

            expect(component.workouts).toContain(newWorkout);
            expect(alertService.alert()?.message).toContain('Running');
        });
    });

    describe('showAlert()', () => {
        it('forwards the alert to the AlertService', () => {
            const alertService = TestBed.inject(AlertService);
            vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

            component.showAlert({ severity: 'info', message: 'Hello' });

            expect(alertService.alert()).toEqual({ severity: 'info', message: 'Hello' });
        });
    });

    describe('customizeCalendar() (event rendering)', () => {
        function buildEventMountArg(title: string): EventMountArg {
            const el = document.createElement('div');
            const span = document.createElement('span');
            span.className = 'text-sm';
            el.appendChild(span);

            return { event: { title }, el } as unknown as EventMountArg;
        }

        it('applies the known label and color for a recognized muscle group', () => {
            const info = buildEventMountArg('Pectoraux');

            component['customizeCalendar'](info);

            expect(info.el.querySelector('span.text-sm')?.textContent).toBe('Pecs');
            expect(info.el.style.borderLeftColor).toBe('rgb(213, 0, 0)');
        });

        it('falls back to the raw title and a default color for an unknown muscle group', () => {
            const info = buildEventMountArg('Unknown Muscle');

            component['customizeCalendar'](info);

            expect(info.el.querySelector('span.text-sm')?.textContent).toBe('Unknown Muscle');
            expect(info.el.style.borderLeftColor).toBe('rgb(215, 124, 5)');
        });
    });

    describe('eventClick() (viewing a workout)', () => {
        it('opens the workout detail modal with the workout returned by the API', () => {
            const workoutService = TestBed.inject(WorkoutService);

            component.calendarOptions.eventClick!({ event: { id: '1' } } as EventClickArg);

            httpMock.expectOne(`${ workoutService.workoutUrl }/1`).flush({});

            expect(component.showModalViewWorkout).toBe(true);
            expect(component.showWorkout).toEqual({});
        });
    });

    describe('dateClick() (starting a cardio workout)', () => {
        it('opens the cardio exercise dialog when the user has cardio exercises', () => {
            const exerciseService = TestBed.inject(ExerciseService);
            const clickedDate = new Date(2026, 0, 15);
            const cardioExercises: Exercise[] = [{ id: 1, name: 'Running' }];

            component.calendarOptions.dateClick!({ date: clickedDate } as DateClickArg);

            httpMock.expectOne(`${ exerciseService.exerciseUrl }/user/cardio`).flush(cardioExercises);

            expect(component.isOpenModalExerciseCardio).toBe(true);
            expect(component.cardioExercises).toEqual(cardioExercises);
        });

        it('shows an error alert when the user has no cardio exercises yet', () => {
            const exerciseService = TestBed.inject(ExerciseService);
            const alertService = TestBed.inject(AlertService);

            component.calendarOptions.dateClick!({ date: new Date() } as DateClickArg);

            httpMock.expectOne(`${ exerciseService.exerciseUrl }/user/cardio`).flush([]);

            expect(component.isOpenModalExerciseCardio).toBe(false);
            expect(alertService.alert()?.severity).toBe('error');
        });
    });
});

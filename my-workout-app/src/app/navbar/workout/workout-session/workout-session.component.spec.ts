import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { WorkoutSessionComponent } from './workout-session.component';
import { ExerciseService } from '../../../services/exercise.service';
import { HistoryService } from '../../../services/history.service';
import { WorkoutService } from '../../../services/workout.service';
import { AlertService } from '../../../services/alert.service';
import { Exercise } from '../../../../interfaces/Exercise';
import { MuscleGroupEnum } from '../../../../interfaces/MuscleGroupEnum';
import { Workout } from '../../../../interfaces/Workout';

describe('WorkoutSessionComponent', () => {
    let fixture: ComponentFixture<WorkoutSessionComponent>;
    let component: WorkoutSessionComponent;
    let httpMock: HttpTestingController;
    let exerciseService: ExerciseService;
    let historyService: HistoryService;
    let confirmationService: ConfirmationService;

    const squat: Exercise = { id: 1, name: 'Squat' };
    const legPress: Exercise = { id: 2, name: 'Leg press' };

    function createComponent() {
        TestBed.configureTestingModule({
            imports: [WorkoutSessionComponent],
            providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
        });

        fixture = TestBed.createComponent(WorkoutSessionComponent);
        fixture.componentRef.setInput('muscleGroupId', MuscleGroupEnum.JAMBES);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        exerciseService = TestBed.inject(ExerciseService);
        historyService = TestBed.inject(HistoryService);
        confirmationService = fixture.debugElement.injector.get(ConfirmationService);
    }

    function loadWithExercises(exercises: Exercise[] = [squat, legPress]) {
        fixture.detectChanges();
        httpMock.expectOne(`${ exerciseService.exerciseUrl }/user/added/${ MuscleGroupEnum.JAMBES }`)
            .flush(exercises);
        httpMock.expectOne(`${ historyService.historyUrl }/last/${ exercises[0].id }`).flush(null);
    }

    afterEach(() => {
        httpMock.verify();
    });

    describe('loading exercises', () => {
        it('selects the first exercise and loads its last weight/reps once exercises are loaded', () => {
            createComponent();
            loadWithExercises();

            expect(component.exercises).toEqual([squat, legPress]);
            expect(component.currentExercise).toEqual(squat);
        });

        it('prompts to add exercises and redirects home on reject when the muscle group is empty', () => {
            createComponent();
            const router = TestBed.inject(Router);
            const navigateSpy = vi.spyOn(router, 'navigate');
            const confirmSpy = vi.spyOn(confirmationService, 'confirm');

            fixture.detectChanges();
            httpMock.expectOne(`${ exerciseService.exerciseUrl }/user/added/${ MuscleGroupEnum.JAMBES }`).flush([]);

            const { reject } = confirmSpy.mock.calls[0][0];
            reject!();

            expect(navigateSpy).toHaveBeenCalledWith(['/', 'workout']);
        });

        it('redirects home and shows an alert when the muscle group does not exist', () => {
            createComponent();
            const router = TestBed.inject(Router);
            const navigateSpy = vi.spyOn(router, 'navigate');
            const alertService = TestBed.inject(AlertService);

            fixture.detectChanges();
            httpMock.expectOne(`${ exerciseService.exerciseUrl }/user/added/${ MuscleGroupEnum.JAMBES }`)
                .flush({ errorCode: 'muscleGroupDoesntExist' }, { status: 404, statusText: 'Not Found' });

            expect(navigateSpy).toHaveBeenCalledWith(['/', 'workout']);
            expect(alertService.alert()?.severity).toBe('error');
        });
    });

    describe('step navigation', () => {
        beforeEach(() => {
            createComponent();
            loadWithExercises();
        });

        it('nextStep() moves to the next exercise and loads its last weight/reps', () => {
            component['nextStep']();
            httpMock.expectOne(`${ historyService.historyUrl }/last/${ legPress.id }`).flush(null);

            expect(component.activeStep).toBe(2);
            expect(component.currentExercise).toEqual(legPress);
            expect(component.animationDirection).toBe('right');
        });

        it('nextStep() does nothing past the last exercise', () => {
            component['nextStep']();
            httpMock.expectOne(`${ historyService.historyUrl }/last/${ legPress.id }`).flush(null);

            component['nextStep']();

            expect(component.activeStep).toBe(2);
        });

        it('previousStep() does nothing before the first exercise', () => {
            component['previousStep']();

            expect(component.activeStep).toBe(1);
        });
    });

    describe('timer and workout creation', () => {
        beforeEach(() => {
            createComponent();
            loadWithExercises();
        });

        it('toggleTimer() creates a workout and starts the timer on the first click', () => {
            const workoutService = TestBed.inject(WorkoutService);
            const createdWorkout: Workout = {
                id: 1,
                date: new Date(),
                histories: [{ id: 10, exercise: squat }]
            };

            component.toggleTimer();

            httpMock.expectOne(workoutService.workoutUrl).flush(createdWorkout);

            expect(component.workout).toEqual(createdWorkout);
            expect(component.exercisesMade.getValue()).toHaveLength(1);
            expect(component.formWorkout.disabled).toBe(true);
        });

        it('toggleTimer() stops the timer and re-enables the form on the second click', () => {
            vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'performance'] });

            const workoutService = TestBed.inject(WorkoutService);
            component.toggleTimer();
            httpMock.expectOne(workoutService.workoutUrl)
                .flush({ id: 1, date: new Date(), histories: [{ id: 10, exercise: squat }] });

            // Let the rest timer tick at least once so it is no longer at its default value.
            vi.advanceTimersByTime(1500);

            component.toggleTimer();

            expect(component.formWorkout.disabled).toBe(false);
            expect(component.exercisesMade.getValue()[0].restTime).not.toBe('/');

            vi.useRealTimers();
        });

        it('shows an error alert when creating the workout fails', () => {
            const alertService = TestBed.inject(AlertService);
            const workoutService = TestBed.inject(WorkoutService);

            component.toggleTimer();
            httpMock.expectOne(workoutService.workoutUrl).flush('error', { status: 500, statusText: 'Server error' });

            expect(alertService.alert()?.severity).toBe('error');
        });
    });

    describe('convertWeightToElastics()', () => {
        beforeEach(() => {
            createComponent();
            loadWithExercises();
        });

        it('converts the current weight into the matching elastic combination', () => {
            component.formWorkout.controls.weight.setValue(15);

            component.convertWeightToElastics();

            expect(component.weightToElastics.map(e => e.weight)).toEqual([15]);
        });
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
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

            expect(component['exercises']()).toEqual([squat, legPress]);
            expect(component['currentExercise']()).toEqual(squat);
        });

        it('prompts to add exercises when the muscle group is empty', () => {
            createComponent();

            fixture.detectChanges();
            httpMock.expectOne(`${ exerciseService.exerciseUrl }/user/added/${ MuscleGroupEnum.JAMBES }`).flush([]);

            expect(component['confirmNoExercisesOpen']()).toBe(true);
        });

        it('cancelAddExercises() closes the dialog and redirects to the workout home', () => {
            createComponent();
            const router = TestBed.inject(Router);
            const navigateSpy = vi.spyOn(router, 'navigate');

            fixture.detectChanges();
            httpMock.expectOne(`${ exerciseService.exerciseUrl }/user/added/${ MuscleGroupEnum.JAMBES }`).flush([]);

            component['cancelAddExercises']();

            expect(component['confirmNoExercisesOpen']()).toBe(false);
            expect(navigateSpy).toHaveBeenCalledWith(['/', 'workout']);
        });

        it('confirmAddExercises() closes the dialog and navigates to the library for this muscle group', () => {
            createComponent();
            const router = TestBed.inject(Router);
            const navigateSpy = vi.spyOn(router, 'navigate');

            fixture.detectChanges();
            httpMock.expectOne(`${ exerciseService.exerciseUrl }/user/added/${ MuscleGroupEnum.JAMBES }`).flush([]);

            component['confirmAddExercises']();

            expect(component['confirmNoExercisesOpen']()).toBe(false);
            expect(navigateSpy).toHaveBeenCalledWith(['/', 'library'], { queryParams: { muscleGroup: MuscleGroupEnum.JAMBES } });
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

            expect(component['activeStep']()).toBe(2);
            expect(component['currentExercise']()).toEqual(legPress);
            expect(component['animationDirection']()).toBe('right');
        });

        it('nextStep() does nothing past the last exercise', () => {
            component['nextStep']();
            httpMock.expectOne(`${ historyService.historyUrl }/last/${ legPress.id }`).flush(null);

            component['nextStep']();

            expect(component['activeStep']()).toBe(2);
        });

        it('previousStep() does nothing before the first exercise', () => {
            component['previousStep']();

            expect(component['activeStep']()).toBe(1);
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
            expect(component.exercisesMade()).toHaveLength(1);
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
            expect(component.exercisesMade()[0].restTime).not.toBe('/');

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

    describe('form field handlers', () => {
        beforeEach(() => {
            createComponent();
            loadWithExercises();
        });

        it('onWeightChange() updates the form control', () => {
            component['onWeightChange'](15);

            expect(component.formWorkout.controls.weight.value).toBe(15);
        });

        it('onRepsChange() updates the form control', () => {
            component['onRepsChange'](12);

            expect(component.formWorkout.controls.reps.value).toBe(12);
        });

        it('onUnilateralChange() updates the form control', () => {
            component['onUnilateralChange'](true);

            expect(component.formWorkout.controls.unilateral.value).toBe(true);
        });
    });
});

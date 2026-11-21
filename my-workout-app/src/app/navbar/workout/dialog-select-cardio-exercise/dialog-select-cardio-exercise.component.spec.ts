import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DialogSelectCardioExerciseComponent } from './dialog-select-cardio-exercise.component';
import { WorkoutService } from '../../../services/workout.service';
import { Workout } from '../../../../interfaces/Workout';

describe('DialogSelectCardioExerciseComponent', () => {
    let fixture: ComponentFixture<DialogSelectCardioExerciseComponent>;
    let component: DialogSelectCardioExerciseComponent;
    let httpMock: HttpTestingController;
    let workoutService: WorkoutService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DialogSelectCardioExerciseComponent],
            providers: [provideHttpClient(), provideHttpClientTesting()]
        });

        fixture = TestBed.createComponent(DialogSelectCardioExerciseComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        workoutService = TestBed.inject(WorkoutService);

        fixture.detectChanges();
        component['showInputDuration']({ id: 1, name: 'Running' });
        component.inputDuration = 30;
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('showInputDuration() selects the exercise to configure', () => {
        component['showInputDuration']({ id: 2, name: 'Cycling' });

        expect(component['selectedExercise']()).toEqual({ id: 2, name: 'Cycling' });
    });

    it('onHideModal() resets the selected exercise and duration, and closes the dialog', () => {
        component.openModal.set(true);

        component['onHideModal']();

        expect(component['selectedExercise']()).toBeNull();
        expect(component.inputDuration).toBeNull();
        expect(component.openModal()).toBe(false);
    });

    describe('createCardioWorkout()', () => {
        it('creates the workout, emits it, shows a success alert and closes the dialog', () => {
            let created: Workout | undefined;
            let shownAlert: unknown;
            component.createdWorkout.subscribe(workout => created = workout);
            component.showAlert.subscribe(alert => shownAlert = alert);
            component.openModal.set(true);

            component['createCardioWorkout']();

            const req = httpMock.expectOne(workoutService.workoutUrl);
            expect(req.request.body).toMatchObject({
                history: { duration: 30, exercise: { id: 1 } }
            });

            const createdWorkout: Workout = { id: 1, date: new Date(), histories: [] };
            req.flush(createdWorkout);

            expect(created?.histories).toHaveLength(1);
            expect(created?.histories?.[0].exercise).toEqual({ id: 1, name: 'Running' });
            expect(shownAlert).toEqual(expect.objectContaining({ severity: 'success' }));
            expect(component.openModal()).toBe(false);
            expect(component['selectedExercise']()).toBeNull();
        });

        it('shows an error alert when creating the workout fails', () => {
            let shownAlert: unknown;
            component.showAlert.subscribe(alert => shownAlert = alert);

            component['createCardioWorkout']();

            httpMock.expectOne(workoutService.workoutUrl)
                .flush('error', { status: 500, statusText: 'Server error' });

            expect(shownAlert).toEqual(expect.objectContaining({ severity: 'error' }));
        });
    });
});

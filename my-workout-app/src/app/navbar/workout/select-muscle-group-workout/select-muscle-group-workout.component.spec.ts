import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { SelectMuscleGroupWorkoutComponent } from './select-muscle-group-workout.component';
import { MuscleGroupService } from '../../../services/muscle-group.service';
import { ExerciseService } from '../../../services/exercise.service';
import { AlertService } from '../../../services/alert.service';
import { MuscleGroupEnum } from '../../../../interfaces/MuscleGroupEnum';
import { MuscleGroupExerciseCount } from '../../../../interfaces/MuscleGroupExerciseCount';

describe('SelectMuscleGroupWorkoutComponent', () => {
    let fixture: ComponentFixture<SelectMuscleGroupWorkoutComponent>;
    let component: SelectMuscleGroupWorkoutComponent;
    let httpMock: HttpTestingController;
    let muscleGroupService: MuscleGroupService;
    let exerciseService: ExerciseService;
    let confirmationService: ConfirmationService;
    let router: Router;

    const recommended: MuscleGroupExerciseCount[] = [
        { exerciseCount: 3, muscleGroup: { id: MuscleGroupEnum.PECTORAUX, name: 'pectoraux' } }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SelectMuscleGroupWorkoutComponent],
            providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
        });

        fixture = TestBed.createComponent(SelectMuscleGroupWorkoutComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        muscleGroupService = TestBed.inject(MuscleGroupService);
        exerciseService = TestBed.inject(ExerciseService);
        confirmationService = fixture.debugElement.injector.get(ConfirmationService);
        router = TestBed.inject(Router);
    });

    afterEach(() => {
        httpMock.verify();
    });

    function loadInitialData(cardioExercises: unknown[] = []) {
        fixture.detectChanges();
        httpMock.expectOne(`${ muscleGroupService.muscleGroupUrl }/recommended`).flush(recommended);
        httpMock.expectOne(`${ exerciseService.exerciseUrl }/user/cardio`).flush(cardioExercises);
    }

    it('loads the recommended muscle groups and cardio exercises on init', () => {
        loadInitialData([{ id: 1, name: 'Running' }]);

        expect(component.muscleGroupExerciseCount).toEqual(recommended);
        expect(component.cardioExercises).toEqual([{ id: 1, name: 'Running' }]);
    });

    it('navigates to the workout session for a non-cardio muscle group', () => {
        loadInitialData();
        const navigateSpy = vi.spyOn(router, 'navigate');

        component['clickMuscleGroup']({ id: MuscleGroupEnum.PECTORAUX, name: 'pectoraux' });

        expect(navigateSpy).toHaveBeenCalledWith(['/', 'workout', 'workout-session', MuscleGroupEnum.PECTORAUX]);
    });

    it('opens the cardio dialog when the user already has cardio exercises added', () => {
        loadInitialData();
        component.muscleGroupExerciseCount = [
            { exerciseCount: 1, muscleGroup: { id: MuscleGroupEnum.CARDIO, name: 'cardio' } }
        ];

        component['clickMuscleGroup']({ id: MuscleGroupEnum.CARDIO, name: 'cardio' });

        expect(component.isOpenModalExerciseCardio).toBe(true);
    });

    it('prompts to add exercises when clicking cardio without any cardio exercise added', () => {
        loadInitialData();
        const confirmSpy = vi.spyOn(confirmationService, 'confirm');

        component['clickMuscleGroup']({ id: MuscleGroupEnum.CARDIO, name: 'cardio' });

        expect(confirmSpy).toHaveBeenCalledOnce();
        expect(component.isOpenModalExerciseCardio).toBe(false);
    });

    it('showAlert() forwards the alert to the AlertService', () => {
        loadInitialData();
        const alertService = TestBed.inject(AlertService);
        vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

        component['showAlert']({ severity: 'info', message: 'Hello' });

        expect(alertService.alert()).toEqual({ severity: 'info', message: 'Hello' });
    });

    it('openModalCardioExerciseChange() closes the modal and refreshes the recommended groups', () => {
        loadInitialData();

        component.openModalCardioExerciseChange();

        expect(component.isOpenModalExerciseCardio).toBe(false);
        httpMock.expectOne(`${ muscleGroupService.muscleGroupUrl }/recommended`).flush(recommended);
    });
});

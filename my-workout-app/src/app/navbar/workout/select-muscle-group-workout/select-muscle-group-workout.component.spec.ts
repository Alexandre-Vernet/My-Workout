import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { SelectMuscleGroupWorkoutComponent } from './select-muscle-group-workout.component';
import { MuscleGroupService } from '../../../services/muscle-group.service';
import { ExerciseService } from '../../../services/exercise.service';
import { GymService } from '../../../services/gym.service';
import { AlertService } from '../../../services/alert.service';
import { MuscleGroupEnum } from '../../../../interfaces/MuscleGroupEnum';
import { MuscleGroupExerciseCount } from '../../../../interfaces/MuscleGroupExerciseCount';
import { Gym } from '../../../../interfaces/gym';

describe('SelectMuscleGroupWorkoutComponent', () => {
    let fixture: ComponentFixture<SelectMuscleGroupWorkoutComponent>;
    let component: SelectMuscleGroupWorkoutComponent;
    let httpMock: HttpTestingController;
    let muscleGroupService: MuscleGroupService;
    let exerciseService: ExerciseService;
    let gymService: GymService;
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
        gymService = TestBed.inject(GymService);
        router = TestBed.inject(Router);
    });

    afterEach(() => {
        httpMock.verify();
    });

    function loadInitialData(cardioExercises: unknown[] = [], gyms: Gym[] = []) {
        fixture.detectChanges();
        httpMock.expectOne(`${ muscleGroupService.muscleGroupUrl }/recommended`).flush(recommended);
        httpMock.expectOne(`${ exerciseService.exerciseUrl }/user/cardio`).flush(cardioExercises);
        httpMock.expectOne(gymService.gymUrl).flush(gyms);
    }

    it('starts with no muscle groups loaded, so the skeleton can render', () => {
        expect(component['muscleGroupExerciseCount']()).toBeNull();
    });

    it('loads the recommended muscle groups and cardio exercises on init', () => {
        loadInitialData([{ id: 1, name: 'Running' }]);

        expect(component['muscleGroupExerciseCount']()).toEqual(recommended);
        expect(component['cardioExercises']()).toEqual([{ id: 1, name: 'Running' }]);
    });

    it('blocks access to the muscle group list and shows the no-gym state when the user has no gym', () => {
        loadInitialData();
        fixture.detectChanges();

        const cards = fixture.nativeElement.querySelectorAll('.muscle-group-card');
        const noGymState = fixture.nativeElement.querySelector('.no-gym-state');
        expect(cards.length).toBe(0);
        expect(noGymState).toBeTruthy();
    });

    it('navigates to the workout session for a non-cardio muscle group, with no gym when the user has none', () => {
        loadInitialData();
        const navigateSpy = vi.spyOn(router, 'navigate');

        component['clickMuscleGroup']({ id: MuscleGroupEnum.PECTORAUX, name: 'pectoraux' });

        expect(navigateSpy).toHaveBeenCalledWith(
            ['/', 'workout', 'workout-session', MuscleGroupEnum.PECTORAUX],
            { queryParams: {} }
        );
    });

    it('navigates with the gym pre-selected when the user has exactly one, without prompting', () => {
        loadInitialData([], [{ id: 1, name: 'Salle unique' }]);
        const navigateSpy = vi.spyOn(router, 'navigate');

        component['clickMuscleGroup']({ id: MuscleGroupEnum.PECTORAUX, name: 'pectoraux' });

        expect(component['gymPickerOpen']()).toBe(false);
        expect(navigateSpy).toHaveBeenCalledWith(
            ['/', 'workout', 'workout-session', MuscleGroupEnum.PECTORAUX],
            { queryParams: { gymId: 1 } }
        );
    });

    it('opens the gym picker when the user has several gyms, instead of navigating right away', () => {
        loadInitialData([], [{ id: 1, name: 'Salle A' }, { id: 2, name: 'Salle B' }]);
        const navigateSpy = vi.spyOn(router, 'navigate');

        component['clickMuscleGroup']({ id: MuscleGroupEnum.PECTORAUX, name: 'pectoraux' });

        expect(component['gymPickerOpen']()).toBe(true);
        expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('selectGym() closes the picker and navigates with the chosen gym', () => {
        loadInitialData([], [{ id: 1, name: 'Salle A' }, { id: 2, name: 'Salle B' }]);
        const navigateSpy = vi.spyOn(router, 'navigate');

        component['clickMuscleGroup']({ id: MuscleGroupEnum.PECTORAUX, name: 'pectoraux' });
        component['selectGym']({ id: 2, name: 'Salle B' });

        expect(component['gymPickerOpen']()).toBe(false);
        expect(navigateSpy).toHaveBeenCalledWith(
            ['/', 'workout', 'workout-session', MuscleGroupEnum.PECTORAUX],
            { queryParams: { gymId: 2 } }
        );
    });

    it('cancelGymPicker() closes the picker without navigating', () => {
        loadInitialData([], [{ id: 1, name: 'Salle A' }, { id: 2, name: 'Salle B' }]);
        const navigateSpy = vi.spyOn(router, 'navigate');

        component['clickMuscleGroup']({ id: MuscleGroupEnum.PECTORAUX, name: 'pectoraux' });
        component['cancelGymPicker']();

        expect(component['gymPickerOpen']()).toBe(false);
        expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('opens the cardio dialog when the user already has cardio exercises added', () => {
        loadInitialData();
        component['muscleGroupExerciseCount'].set([
            { exerciseCount: 1, muscleGroup: { id: MuscleGroupEnum.CARDIO, name: 'cardio' } }
        ]);

        component['clickMuscleGroup']({ id: MuscleGroupEnum.CARDIO, name: 'cardio' });

        expect(component['isOpenModalExerciseCardio']()).toBe(true);
    });

    it('prompts to add exercises when clicking cardio without any cardio exercise added', () => {
        loadInitialData();

        component['clickMuscleGroup']({ id: MuscleGroupEnum.CARDIO, name: 'cardio' });

        expect(component['confirmNoExercisesOpen']()).toBe(true);
        expect(component['isOpenModalExerciseCardio']()).toBe(false);
    });

    it('confirmAddExercises() closes the dialog and navigates to the library for the pending muscle group', () => {
        loadInitialData();
        const navigateSpy = vi.spyOn(router, 'navigate');

        component['clickMuscleGroup']({ id: MuscleGroupEnum.CARDIO, name: 'cardio' });
        component['confirmAddExercises']();

        expect(component['confirmNoExercisesOpen']()).toBe(false);
        expect(navigateSpy).toHaveBeenCalledWith(['/', 'library'], { queryParams: { muscleGroup: MuscleGroupEnum.CARDIO } });
    });

    it('cancelAddExercises() closes the dialog and navigates back to the workout home', () => {
        loadInitialData();
        const navigateSpy = vi.spyOn(router, 'navigate');

        component['clickMuscleGroup']({ id: MuscleGroupEnum.CARDIO, name: 'cardio' });
        component['cancelAddExercises']();

        expect(component['confirmNoExercisesOpen']()).toBe(false);
        expect(navigateSpy).toHaveBeenCalledWith(['/', 'workout']);
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

        component['openModalCardioExerciseChange']();

        expect(component['isOpenModalExerciseCardio']()).toBe(false);
        httpMock.expectOne(`${ muscleGroupService.muscleGroupUrl }/recommended`).flush(recommended);
    });
});

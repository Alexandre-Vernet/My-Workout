import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AddExerciseComponent } from './add-exercise.component';
import { ExerciseService } from '../../../../services/exercise.service';
import { MuscleService } from '../../../../services/muscle.service';
import { AlertService } from '../../../../services/alert.service';
import { MuscleDropdown } from '../../../../../interfaces/MuscleDropdown';
import { DifficultyEnum } from '../../../../../interfaces/DifficultyEnum';
import { MechanicEnum } from '../../../../../interfaces/MechanicEnum';

describe('AddExerciseComponent', () => {
    let fixture: ComponentFixture<AddExerciseComponent>;
    let component: AddExerciseComponent;
    let httpMock: HttpTestingController;
    let exerciseService: ExerciseService;
    let muscleService: MuscleService;
    let confirmationService: ConfirmationService;

    const musclesDropdown: MuscleDropdown[] = [
        { label: 'Pectoraux', value: 'pectoraux', items: [{ id: 1, name: 'Grand pectoral' }] }
    ];

    function createComponent() {
        TestBed.configureTestingModule({
            imports: [AddExerciseComponent],
            providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
        });

        fixture = TestBed.createComponent(AddExerciseComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        exerciseService = TestBed.inject(ExerciseService);
        muscleService = TestBed.inject(MuscleService);
        confirmationService = fixture.debugElement.injector.get(ConfirmationService);
    }

    afterEach(() => {
        httpMock.verify();
    });

    describe('ngOnInit()', () => {
        it('only loads the muscle dropdown when creating a new exercise', () => {
            createComponent();
            fixture.detectChanges();

            httpMock.expectOne(muscleService.muscleUrl).flush(musclesDropdown);

            expect(component.musclesDropdown).toEqual(musclesDropdown);
            httpMock.expectNone(r => r.url.startsWith(exerciseService.exerciseUrl));
        });

        it('prefills the form with the existing exercise when editing', () => {
            createComponent();
            fixture.componentRef.setInput('exerciseId', 7);
            fixture.detectChanges();

            httpMock.expectOne(muscleService.muscleUrl).flush(musclesDropdown);
            httpMock.expectOne(`${ exerciseService.exerciseUrl }/7`).flush({
                exercise: {
                    id: 7,
                    name: 'Bench press',
                    description: 'A compound chest exercise.',
                    difficulty: DifficultyEnum.INTERMEDIATE,
                    mechanic: MechanicEnum.COMPOUND
                },
                muscles: [{ id: 1, name: 'Grand pectoral' }]
            });

            expect(component.formAddExercise.value).toMatchObject({
                id: 7,
                name: 'Bench press',
                description: 'A compound chest exercise.',
                difficulty: DifficultyEnum.INTERMEDIATE,
                mechanic: MechanicEnum.COMPOUND
            });
            expect(component.formAddExercise.controls.muscles.value).toEqual(musclesDropdown[0].items);
        });

        it('redirects to not-found when the exercise to edit does not exist', () => {
            createComponent();
            const router = TestBed.inject(Router);
            const navigateSpy = vi.spyOn(router, 'navigate');

            fixture.componentRef.setInput('exerciseId', 999);
            fixture.detectChanges();

            httpMock.expectOne(muscleService.muscleUrl).flush(musclesDropdown);
            httpMock.expectOne(`${ exerciseService.exerciseUrl }/999`)
                .flush('not found', { status: 404, statusText: 'Not Found' });

            expect(navigateSpy).toHaveBeenCalledWith(['not-found']);
        });
    });

    describe('generateExerciseDescription()', () => {
        beforeEach(() => {
            createComponent();
            fixture.detectChanges();
            httpMock.expectOne(muscleService.muscleUrl).flush(musclesDropdown);
            component.formAddExercise.controls.name.setValue('Squat');
        });

        it('fills the description field on success', () => {
            component.generateExerciseDescription();

            httpMock.expectOne(r => r.url === `${ exerciseService.exerciseUrl }/description`)
                .flush({ description: 'A compound leg exercise.' });

            expect(component.formAddExercise.controls.description.value).toBe('A compound leg exercise.');
            expect(component.loadingDescription).toBe(false);
        });

        it('flags a quota-exceeded error on the description field', () => {
            component.generateExerciseDescription();

            httpMock.expectOne(r => r.url === `${ exerciseService.exerciseUrl }/description`)
                .flush({ errorCode: 'QUOTA_EXCEEDED' }, { status: 429, statusText: 'Too Many Requests' });

            expect(component.formAddExercise.controls.description.hasError('quotaExceeded')).toBe(true);
        });
    });

    describe('createExercise()', () => {
        beforeEach(() => {
            createComponent();
            fixture.detectChanges();
            httpMock.expectOne(muscleService.muscleUrl).flush(musclesDropdown);

            component.formAddExercise.setValue({
                id: null,
                name: 'Squat',
                description: 'A compound leg exercise.',
                muscles: musclesDropdown[0].items,
                difficulty: DifficultyEnum.BEGINNER,
                mechanic: MechanicEnum.COMPOUND
            });
        });

        it('shows a success alert and offers to add the new exercise to the workout', () => {
            const alertService = TestBed.inject(AlertService);
            const confirmSpy = vi.spyOn(confirmationService, 'confirm');

            component.createExercise({ target: document.createElement('button') } as unknown as Event);

            httpMock.expectOne(exerciseService.exerciseUrl).flush({ id: 1, name: 'Squat' });

            expect(alertService.alert()?.severity).toBe('success');
            expect(confirmSpy).toHaveBeenCalledOnce();
        });

        it('does not prompt to add to the workout when updating an existing exercise', () => {
            component.formAddExercise.controls.id.setValue(1);
            const confirmSpy = vi.spyOn(confirmationService, 'confirm');

            component.createExercise({ target: document.createElement('button') } as unknown as Event);

            httpMock.expectOne(exerciseService.exerciseUrl).flush({ id: 1, name: 'Squat' });

            expect(confirmSpy).not.toHaveBeenCalled();
        });

        it('flags a duplicate exercise name on the name field', () => {
            component.createExercise({ target: document.createElement('button') } as unknown as Event);

            httpMock.expectOne(exerciseService.exerciseUrl)
                .flush({ errorCode: 'EXERCISE_NAME_ALREADY_EXIST' }, { status: 409, statusText: 'Conflict' });

            expect(component.formAddExercise.controls.name.hasError('exerciseNameAlreadyExist')).toBe(true);
        });

        it('flags a duplicate muscle group on the muscles field', () => {
            component.createExercise({ target: document.createElement('button') } as unknown as Event);

            httpMock.expectOne(exerciseService.exerciseUrl)
                .flush({ errorCode: 'DOUBLE_MUSCLE_GROUP' }, { status: 409, statusText: 'Conflict' });

            expect(component.formAddExercise.controls.muscles.hasError('duplicatMuscleGroup')).toBe(true);
        });

        it('accepting the workout prompt adds the exercise to the workout', () => {
            const alertService = TestBed.inject(AlertService);
            const confirmSpy = vi.spyOn(confirmationService, 'confirm');

            component.createExercise({ target: document.createElement('button') } as unknown as Event);
            httpMock.expectOne(exerciseService.exerciseUrl).flush({ id: 1, name: 'Squat' });

            const { accept } = confirmSpy.mock.calls[0][0];
            accept!();

            httpMock.expectOne(`${ exerciseService.exerciseUrl }/user/toggle`).flush({ id: 1, name: 'Squat' });

            expect(alertService.alert()?.message).toBe('Exercice ajouté à vos entraînements');
        });

        it('rejecting the workout prompt notifies via the message service', () => {
            const messageService = fixture.debugElement.injector.get(MessageService);
            const addSpy = vi.spyOn(messageService, 'add');
            const confirmSpy = vi.spyOn(confirmationService, 'confirm');

            component.createExercise({ target: document.createElement('button') } as unknown as Event);
            httpMock.expectOne(exerciseService.exerciseUrl).flush({ id: 1, name: 'Squat' });

            const { reject } = confirmSpy.mock.calls[0][0];
            reject!();

            expect(addSpy).toHaveBeenCalledWith(expect.objectContaining({ severity: 'error' }));
        });
    });
});

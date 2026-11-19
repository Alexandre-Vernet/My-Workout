import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ListExercisesComponent } from './list-exercises.component';
import { ExerciseService } from '../../../services/exercise.service';
import { AlertService } from '../../../services/alert.service';
import { Exercise } from '../../../../interfaces/Exercise';

describe('ListExercisesComponent', () => {
    let fixture: ComponentFixture<ListExercisesComponent>;
    let component: ListExercisesComponent;
    let httpMock: HttpTestingController;
    let exerciseService: ExerciseService;

    const exercises: Exercise[] = [
        { id: 1, name: 'Squat' },
        { id: 2, name: 'Bench press' }
    ];

    function setup(queryParams: Record<string, string> = {}) {
        TestBed.configureTestingModule({
            imports: [ListExercisesComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                {
                    provide: ActivatedRoute,
                    useValue: { snapshot: { queryParamMap: convertToParamMap(queryParams) } }
                }
            ]
        });

        fixture = TestBed.createComponent(ListExercisesComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        exerciseService = TestBed.inject(ExerciseService);
    }

    afterEach(() => {
        httpMock.verify();
    });

    it('loads every exercise on init', () => {
        setup();
        fixture.detectChanges();

        httpMock.expectOne(exerciseService.exerciseUrl).flush(exercises);

        expect(component.exercises).toEqual(exercises);
        expect(component.filterExercises).toEqual(exercises);
    });

    it('shows an error alert when the exercise list fails to load', () => {
        setup();
        const alertService = TestBed.inject(AlertService);
        fixture.detectChanges();

        httpMock.expectOne(exerciseService.exerciseUrl)
            .flush('error', { status: 500, statusText: 'Server error' });

        expect(alertService.alert()?.severity).toBe('error');
    });

    it('applies the muscleGroup query param by filtering the library on load', () => {
        setup({ muscleGroup: '2' });
        fixture.detectChanges();

        httpMock.expectOne(exerciseService.exerciseUrl).flush(exercises);
        httpMock.expectOne(`${ exerciseService.exerciseUrl }/muscle-group/2`).flush([exercises[1]]);

        expect(component.selectedMuscleGroup).toBe(2);
        expect(component.filterExercises).toEqual([exercises[1]]);
    });

    describe('filterExercise()', () => {
        beforeEach(() => {
            setup();
            fixture.detectChanges();
            httpMock.expectOne(exerciseService.exerciseUrl).flush(exercises);
        });

        it('filters the library down to the selected muscle group', () => {
            component['filterExercise'](3);

            httpMock.expectOne(`${ exerciseService.exerciseUrl }/muscle-group/3`).flush([exercises[0]]);

            expect(component.selectedMuscleGroup).toBe(3);
            expect(component.filterExercises).toEqual([exercises[0]]);
        });

        it('clicking the already-selected muscle group clears the filter without a new HTTP call', () => {
            component['filterExercise'](3);
            httpMock.expectOne(`${ exerciseService.exerciseUrl }/muscle-group/3`).flush([exercises[0]]);

            component['filterExercise'](3);

            httpMock.expectNone(`${ exerciseService.exerciseUrl }/muscle-group/3`);
            expect(component.selectedMuscleGroup).toBeNull();
            expect(component.filterExercises).toEqual(exercises);
        });
    });

    describe('search', () => {
        beforeEach(() => {
            vi.useFakeTimers();
            setup();
            fixture.detectChanges();
            httpMock.expectOne(exerciseService.exerciseUrl).flush(exercises);
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('restores the full list when the search is cleared', () => {
            component.searchExercise.setValue('');
            vi.advanceTimersByTime(300);

            expect(component.filterExercises).toEqual(exercises);
        });

        it('filters locally without a server call for a query under 3 characters', () => {
            component['filterExercise'](3);
            httpMock.expectOne(`${ exerciseService.exerciseUrl }/muscle-group/3`).flush([exercises[0]]);

            component.searchExercise.setValue('sq');
            vi.advanceTimersByTime(300);

            httpMock.expectNone(`${ exerciseService.exerciseUrl }/search`);
            expect(component.filterExercises).toEqual([exercises[0]]);
        });

        it('calls the search endpoint for a query of 3+ characters and clears the muscle group filter', () => {
            component.selectedMuscleGroup = 3;

            component.searchExercise.setValue('squ');
            vi.advanceTimersByTime(300);

            const req = httpMock.expectOne(r => r.url === `${ exerciseService.exerciseUrl }/search`);
            expect(req.request.params.get('search')).toBe('squ');
            req.flush([exercises[0]]);

            expect(component.filterExercises).toEqual([exercises[0]]);
            expect(component.selectedMuscleGroup).toBeNull();
        });
    });
});

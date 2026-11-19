import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { ViewExerciseComponent } from './view-exercise.component';
import { ExerciseService } from '../../../services/exercise.service';
import { AuthService } from '../../../auth/auth.service';
import { AlertService } from '../../../services/alert.service';
import { ExerciseMuscle } from '../../../../interfaces/ExerciseMuscle';
import { DifficultyEnum } from '../../../../interfaces/DifficultyEnum';

describe('ViewExerciseComponent', () => {
    let fixture: ComponentFixture<ViewExerciseComponent>;
    let component: ViewExerciseComponent;
    let httpMock: HttpTestingController;
    let exerciseService: ExerciseService;
    let authService: AuthService;

    const exerciseMuscle: ExerciseMuscle = {
        exercise: { id: 5, name: 'Squat' },
        muscles: [],
        addedToWorkout: false
    };

    function createComponent() {
        TestBed.configureTestingModule({
            imports: [ViewExerciseComponent],
            providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
        });

        fixture = TestBed.createComponent(ViewExerciseComponent);
        fixture.componentRef.setInput('exerciseId', 5);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        exerciseService = TestBed.inject(ExerciseService);
        authService = TestBed.inject(AuthService);
    }

    afterEach(() => {
        httpMock.verify();
    });

    it('loads the current user and the exercise, and builds the image path from the exercise id', () => {
        createComponent();

        fixture.detectChanges();
        httpMock.expectOne(`${ authService.authUrl }/me`).flush({ id: 1, email: 'alex@example.com' });
        httpMock.expectOne(`${ exerciseService.exerciseUrl }/5`).flush(exerciseMuscle);

        expect(component.user?.email).toBe('alex@example.com');
        expect(component.exerciseMuscle).toEqual(exerciseMuscle);
        expect(component.imagePath).toBe('/assets/images/5.gif');
    });

    it('redirects to not-found when the exercise cannot be loaded', () => {
        createComponent();
        const router = TestBed.inject(Router);
        const navigateSpy = vi.spyOn(router, 'navigate');

        fixture.detectChanges();
        httpMock.expectOne(`${ authService.authUrl }/me`).flush({ id: 1, email: 'alex@example.com' });
        httpMock.expectOne(`${ exerciseService.exerciseUrl }/5`).flush('not found', { status: 404, statusText: 'Not Found' });

        expect(navigateSpy).toHaveBeenCalledWith(['not-found']);
    });

    describe('toggleExerciseWorkout()', () => {
        beforeEach(() => {
            createComponent();
            fixture.detectChanges();
            httpMock.expectOne(`${ authService.authUrl }/me`).flush({ id: 1, email: 'alex@example.com' });
            httpMock.expectOne(`${ exerciseService.exerciseUrl }/5`).flush(exerciseMuscle);
        });

        it('flips the addedToWorkout flag on success', () => {
            component.toggleExerciseWorkout();

            httpMock.expectOne(`${ exerciseService.exerciseUrl }/user/toggle`).flush({ id: 5, name: 'Squat' });

            expect(component.exerciseMuscle.addedToWorkout).toBe(true);
        });

        it('shows an error alert on failure', () => {
            const alertService = TestBed.inject(AlertService);

            component.toggleExerciseWorkout();

            httpMock.expectOne(`${ exerciseService.exerciseUrl }/user/toggle`)
                .flush('error', { status: 500, statusText: 'Server error' });

            expect(alertService.alert()?.severity).toBe('error');
        });
    });

    it('updateExercise() navigates to the admin edit page for this exercise', () => {
        createComponent();
        const router = TestBed.inject(Router);
        const navigateSpy = vi.spyOn(router, 'navigate');

        fixture.detectChanges();
        httpMock.expectOne(`${ authService.authUrl }/me`).flush({ id: 1, email: 'alex@example.com' });
        httpMock.expectOne(`${ exerciseService.exerciseUrl }/5`).flush(exerciseMuscle);

        component.updateExercise();

        expect(navigateSpy).toHaveBeenCalledWith(['admin', 'update-exercise', 5]);
    });

    it('defaults to the "info" tab and switches via setActiveTab()', () => {
        createComponent();

        expect(component['activeTab']()).toBe('info');

        component['setActiveTab']('execution');

        expect(component['activeTab']()).toBe('execution');
    });

    describe('difficultyColor()', () => {
        it('maps each difficulty to its own color', () => {
            createComponent();

            expect(component['difficultyColor'](DifficultyEnum.BEGINNER)).toBe('var(--p-green-500)');
            expect(component['difficultyColor'](DifficultyEnum.INTERMEDIATE)).toBe('var(--p-orange-500)');
            expect(component['difficultyColor'](DifficultyEnum.ADVANCED)).toBe('var(--p-red-500)');
        });

        it('falls back to the muted text color for an unknown difficulty', () => {
            createComponent();

            expect(component['difficultyColor'](undefined)).toBe('var(--p-text-muted-color)');
        });
    });

    it('goBack() navigates up to the parent library route', () => {
        createComponent();
        const router = TestBed.inject(Router);
        const navigateSpy = vi.spyOn(router, 'navigate');

        fixture.detectChanges();
        httpMock.expectOne(`${ authService.authUrl }/me`).flush({ id: 1, email: 'alex@example.com' });
        httpMock.expectOne(`${ exerciseService.exerciseUrl }/5`).flush(exerciseMuscle);

        component['goBack']();

        expect(navigateSpy).toHaveBeenCalledWith(['..'], { relativeTo: component['route'] });
    });
});

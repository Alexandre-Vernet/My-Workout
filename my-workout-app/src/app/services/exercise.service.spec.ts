import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ExerciseService } from './exercise.service';
import { Exercise } from '../../interfaces/Exercise';
import { ExerciseMuscle } from '../../interfaces/ExerciseMuscle';

describe('ExerciseService', () => {
    let service: ExerciseService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()]
        });

        service = TestBed.inject(ExerciseService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('findAll() GETs the exercise list', () => {
        const exercises: Exercise[] = [{ id: 1, name: 'Squat' }];
        let result: Exercise[] | undefined;

        service.findAll().subscribe(res => result = res);

        const req = httpMock.expectOne(`${ service.exerciseUrl }`);
        expect(req.request.method).toBe('GET');
        req.flush(exercises);

        expect(result).toEqual(exercises);
    });

    it('search() sends the query as a search param', () => {
        service.search('squat').subscribe();

        const req = httpMock.expectOne(r => r.url === `${ service.exerciseUrl }/search`);
        expect(req.request.params.get('search')).toBe('squat');
        req.flush([]);
    });

    it('findExercisesByMuscleGroup() GETs exercises for the given muscle group', () => {
        service.findExercisesByMuscleGroup(3).subscribe();

        const req = httpMock.expectOne(`${ service.exerciseUrl }/muscle-group/3`);
        expect(req.request.method).toBe('GET');
        req.flush([]);
    });

    it('findCardioExercises() GETs the user cardio exercises', () => {
        service.findCardioExercises().subscribe();

        httpMock.expectOne(`${ service.exerciseUrl }/user/cardio`).flush([]);
    });

    it('findExerciseMuscle() GETs a single exercise with its muscles', () => {
        const exerciseMuscle: ExerciseMuscle = { exercise: { id: 1, name: 'Squat' }, muscles: [] };
        let result: ExerciseMuscle | undefined;

        service.findExerciseMuscle(1).subscribe(res => result = res);

        httpMock.expectOne(`${ service.exerciseUrl }/1`).flush(exerciseMuscle);
        expect(result).toEqual(exerciseMuscle);
    });

    it('createOrUpdateExercise() POSTs the exercise and its muscles', () => {
        const exerciseMuscle: ExerciseMuscle = { exercise: { name: 'Squat' }, muscles: [] };

        service.createOrUpdateExercise(exerciseMuscle).subscribe();

        const req = httpMock.expectOne(`${ service.exerciseUrl }`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(exerciseMuscle);
        req.flush({ id: 1, name: 'Squat' });
    });

    it('generateExerciseDescription() sends the exercise name as a param', () => {
        service.generateExerciseDescription('Squat').subscribe();

        const req = httpMock.expectOne(r => r.url === `${ service.exerciseUrl }/description`);
        expect(req.request.params.get('exerciseName')).toBe('Squat');
        req.flush({ description: 'A compound leg exercise.' });
    });

    it('findAddedExercisesByMuscleGroupId() GETs the user exercises for a muscle group', () => {
        service.findAddedExercisesByMuscleGroupId(2).subscribe();

        httpMock.expectOne(`${ service.exerciseUrl }/user/added/2`).flush([]);
    });

    it('toggleExerciseWorkout() POSTs the exercise to toggle', () => {
        const exercise: Exercise = { id: 1, name: 'Squat' };

        service.toggleExerciseWorkout(exercise).subscribe();

        const req = httpMock.expectOne(`${ service.exerciseUrl }/user/toggle`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(exercise);
        req.flush(exercise);
    });
});

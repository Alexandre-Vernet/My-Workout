import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { WorkoutService } from './workout.service';
import { Workout } from '../../interfaces/Workout';
import { History } from '../../interfaces/History';

describe('WorkoutService', () => {
    let service: WorkoutService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()]
        });

        service = TestBed.inject(WorkoutService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('create() POSTs the workout and its first history entry together', () => {
        const workout: Workout = { date: new Date(2026, 0, 1) };
        const history: History = { weight: 50, reps: 8 };

        service.create(workout, history).subscribe();

        const req = httpMock.expectOne(service.workoutUrl);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ workout, history });
        req.flush(workout);
    });

    it('findById() GETs a single workout with its grouped histories', () => {
        service.findById(42).subscribe();

        httpMock.expectOne(`${ service.workoutUrl }/42`).flush({});
    });

    it('find() GETs every workout', () => {
        service.find().subscribe();

        httpMock.expectOne(service.workoutUrl).flush([]);
    });

    it('findByDate() sends the local (non-UTC) start/end dates as params', () => {
        const start = new Date(2026, 0, 1);
        const end = new Date(2026, 0, 31);

        service.findByDate(start, end).subscribe();

        const req = httpMock.expectOne(r => r.url === `${ service.workoutUrl }/date`);
        expect(req.request.params.get('start')).toBe('2026-01-01');
        expect(req.request.params.get('end')).toBe('2026-01-31');
        req.flush([]);
    });

    it('delete() DELETEs a workout by id', () => {
        service.delete(42).subscribe();

        const req = httpMock.expectOne(`${ service.workoutUrl }/42`);
        expect(req.request.method).toBe('DELETE');
        req.flush(null);
    });
});

import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { HistoryService } from './history.service';
import { History } from '../../interfaces/History';

describe('HistoryService', () => {
    let service: HistoryService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()]
        });

        service = TestBed.inject(HistoryService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('findLastHistoryWeightByExerciseId() GETs the last weight for an exercise', () => {
        service.findLastHistoryWeightByExerciseId(5).subscribe();

        const req = httpMock.expectOne(r => r.url === `${ service.historyUrl }/last/5`);
        expect(req.request.params.keys().length).toBe(0);
        req.flush({ weight: 60 });
    });

    it('findLastHistoryWeightByExerciseId() passes gymId as a query param when provided', () => {
        service.findLastHistoryWeightByExerciseId(5, 2).subscribe();

        const req = httpMock.expectOne(r => r.url === `${ service.historyUrl }/last/5`);
        expect(req.request.params.get('gymId')).toBe('2');
        req.flush({ weight: 60 });
    });

    it('findTodayExercicesHistory() GETs today\'s history for a muscle group and exercise', () => {
        service.findTodayExercicesHistory(2, 5).subscribe();

        const req = httpMock.expectOne(r => r.url === `${ service.historyUrl }/today/2/5`);
        expect(req.request.params.keys().length).toBe(0);
        req.flush([]);
    });

    it('findTodayExercicesHistory() passes gymId as a query param when provided', () => {
        service.findTodayExercicesHistory(2, 5, 3).subscribe();

        const req = httpMock.expectOne(r => r.url === `${ service.historyUrl }/today/2/5`);
        expect(req.request.params.get('gymId')).toBe('3');
        req.flush([]);
    });

    it('getGlobalStatsWithListExercises() GETs the global stats', () => {
        service.getGlobalStatsWithListExercises().subscribe();

        httpMock.expectOne(`${ service.historyUrl }/stats`).flush({ countTotalDaysWorkout: 10, exercises: [] });
    });

    it('getExerciseGraphs() GETs the graph data for an exercise', () => {
        service.getExerciseGraphs(5).subscribe();

        const req = httpMock.expectOne(r => r.url === `${ service.historyUrl }/exercise-graph/5`);
        expect(req.request.params.keys().length).toBe(0);
        req.flush({
            exercise: { id: 5 },
            historyPoints: [],
            totalWeight: 0,
            maxWeight: 0,
            totalReps: 0
        });
    });

    it('getExerciseGraphs() passes gymId as a query param when provided', () => {
        service.getExerciseGraphs(5, 3).subscribe();

        const req = httpMock.expectOne(r => r.url === `${ service.historyUrl }/exercise-graph/5`);
        expect(req.request.params.get('gymId')).toBe('3');
        req.flush({
            exercise: { id: 5 },
            historyPoints: [],
            totalWeight: 0,
            maxWeight: 0,
            totalReps: 0
        });
    });

    it('update() PATCHes the history entry by id', () => {
        const history: History = { id: 7, weight: 80 };

        service.update(history).subscribe();

        const req = httpMock.expectOne(`${ service.historyUrl }/7`);
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toEqual(history);
        req.flush(history);
    });

    it('delete() DELETEs the history entry by id', () => {
        const history: History = { id: 7 };

        service.delete(history).subscribe();

        const req = httpMock.expectOne(`${ service.historyUrl }/7`);
        expect(req.request.method).toBe('DELETE');
        req.flush(history);
    });
});

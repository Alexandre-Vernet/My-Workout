import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { GraphsComponent } from './graphs.component';
import { HistoryService } from '../../../services/history.service';
import { GymService } from '../../../services/gym.service';
import { ExerciseGraphs } from '../../../../interfaces/ExerciseGraphs';
import { HistoryPoint } from '../../../../interfaces/HistoryPoint';
import { Gym } from '../../../../interfaces/gym';

describe('GraphsComponent', () => {
    let fixture: ComponentFixture<GraphsComponent>;
    let component: GraphsComponent;
    let httpMock: HttpTestingController;
    let historyService: HistoryService;
    let gymService: GymService;

    function manyPoints(count: number): HistoryPoint[] {
        return Array.from({ length: count }, (_, i) => ({
            date: new Date(2020, 0, i + 1),
            weight: 50 + i
        }));
    }

    function detectChangesAndFlushGyms(gyms: Gym[] = []) {
        fixture.detectChanges();
        httpMock.expectOne(r => r.url === gymService.gymUrl).flush(gyms);
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [GraphsComponent],
            providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
        });

        fixture = TestBed.createComponent(GraphsComponent);
        fixture.componentRef.setInput('exerciseId', 5);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        historyService = TestBed.inject(HistoryService);
        gymService = TestBed.inject(GymService);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('loads the exercise graph data on init', () => {
        const exerciseGraphs: ExerciseGraphs = {
            exercise: { id: 5, name: 'Squat' },
            historyPoints: [{ date: new Date(2026, 0, 1), weight: 60 }],
            totalWeight: 600,
            maxWeight: 80,
            totalReps: 50
        };

        detectChangesAndFlushGyms();
        httpMock.expectOne(`${ historyService.historyUrl }/exercise-graph/5`).flush(exerciseGraphs);

        expect(component['exerciseGraphs']()).toEqual(exerciseGraphs);
    });

    it('redirects to not-found when the graph data cannot be loaded', () => {
        const router = TestBed.inject(Router);
        const navigateSpy = vi.spyOn(router, 'navigate');

        detectChangesAndFlushGyms();
        httpMock.expectOne(`${ historyService.historyUrl }/exercise-graph/5`)
            .flush('not found', { status: 404, statusText: 'Not Found' });

        expect(navigateSpy).toHaveBeenCalledWith(['not-found']);
    });

    it('destroys the chart on component destruction', () => {
        detectChangesAndFlushGyms();
        httpMock.expectOne(`${ historyService.historyUrl }/exercise-graph/5`).flush({
            exercise: { id: 5, name: 'Squat' },
            historyPoints: [],
            totalWeight: 0,
            maxWeight: 0,
            totalReps: 0
        });

        const chart = component['chart'];
        const destroySpy = chart ? vi.spyOn(chart, 'destroy') : null;

        fixture.destroy();

        expect(destroySpy).toHaveBeenCalled();
    });

    it('defaults to the "all" period when there are few history points', () => {
        detectChangesAndFlushGyms();
        httpMock.expectOne(`${ historyService.historyUrl }/exercise-graph/5`).flush({
            exercise: { id: 5, name: 'Squat' },
            historyPoints: manyPoints(5),
            totalWeight: 0,
            maxWeight: 0,
            totalReps: 0
        });

        expect(component['selectedPeriod']()).toBe('all');
    });

    it('defaults to the "3m" period when there are many history points', () => {
        detectChangesAndFlushGyms();
        httpMock.expectOne(`${ historyService.historyUrl }/exercise-graph/5`).flush({
            exercise: { id: 5, name: 'Squat' },
            historyPoints: manyPoints(31),
            totalWeight: 0,
            maxWeight: 0,
            totalReps: 0
        });

        expect(component['selectedPeriod']()).toBe('3m');
    });

    it('filteredHistoryPoints() narrows to the selected calendar window', () => {
        const oldPoint: HistoryPoint = { date: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000), weight: 40 };
        const recentPoint: HistoryPoint = { date: new Date(), weight: 60 };

        detectChangesAndFlushGyms();
        httpMock.expectOne(`${ historyService.historyUrl }/exercise-graph/5`).flush({
            exercise: { id: 5, name: 'Squat' },
            historyPoints: [oldPoint, recentPoint],
            totalWeight: 0,
            maxWeight: 0,
            totalReps: 0
        });

        expect(component['filteredHistoryPoints']()).toEqual([oldPoint, recentPoint]);

        // Sets the signal directly rather than going through setPeriod(), which also
        // redraws the Chart.js chart — chart rendering isn't exercised under jsdom
        // (see CLAUDE.md: no canvas 2D context, tolerated without mocking elsewhere).
        component['selectedPeriod'].set('1m');

        expect(component['filteredHistoryPoints']()).toEqual([recentPoint]);
    });

    it('setGym() re-fetches the graph data filtered by the selected gym', () => {
        detectChangesAndFlushGyms([{ id: 1, name: 'Salle A' }, { id: 2, name: 'Salle B' }]);
        httpMock.expectOne(r => r.url === `${ historyService.historyUrl }/exercise-graph/5`).flush({
            exercise: { id: 5, name: 'Squat' },
            historyPoints: [],
            totalWeight: 0,
            maxWeight: 0,
            totalReps: 0
        });

        component['setGym'](2);
        fixture.detectChanges();

        const req = httpMock.expectOne(r => r.url === `${ historyService.historyUrl }/exercise-graph/5`);
        expect(req.request.params.get('gymId')).toBe('2');
        req.flush({
            exercise: { id: 5, name: 'Squat' },
            historyPoints: [],
            totalWeight: 0,
            maxWeight: 0,
            totalReps: 0
        });

        expect(component['selectedGymId']()).toBe(2);
    });
});

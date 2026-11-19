import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { GraphsComponent } from './graphs.component';
import { HistoryService } from '../../../services/history.service';
import { ExerciseGraphs } from '../../../../interfaces/ExerciseGraphs';

describe('GraphsComponent', () => {
    let fixture: ComponentFixture<GraphsComponent>;
    let component: GraphsComponent;
    let httpMock: HttpTestingController;
    let historyService: HistoryService;

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

        fixture.detectChanges();
        httpMock.expectOne(`${ historyService.historyUrl }/exercise-graph/5`).flush(exerciseGraphs);

        expect(component.exerciseGraphs).toEqual(exerciseGraphs);
    });

    it('redirects to not-found when the graph data cannot be loaded', () => {
        const router = TestBed.inject(Router);
        const navigateSpy = vi.spyOn(router, 'navigate');

        fixture.detectChanges();
        httpMock.expectOne(`${ historyService.historyUrl }/exercise-graph/5`)
            .flush('not found', { status: 404, statusText: 'Not Found' });

        expect(navigateSpy).toHaveBeenCalledWith(['not-found']);
    });

    it('destroys the chart on component destruction', () => {
        fixture.detectChanges();
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
});

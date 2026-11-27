import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ExercisesTableComponent } from './exercises-table.component';
import { HistoryService } from '../../../../services/history.service';
import { AlertService } from '../../../../services/alert.service';
import { History } from '../../../../../interfaces/History';

describe('ExercisesTableComponent', () => {
    let fixture: ComponentFixture<ExercisesTableComponent>;
    let component: ExercisesTableComponent;
    let httpMock: HttpTestingController;
    let historyService: HistoryService;

    function createComponent() {
        TestBed.configureTestingModule({
            imports: [ExercisesTableComponent],
            providers: [provideHttpClient(), provideHttpClientTesting()]
        });

        fixture = TestBed.createComponent(ExercisesTableComponent);
        fixture.componentRef.setInput('muscleGroupId', 1);
        fixture.componentRef.setInput('exerciseId', 5);
        fixture.componentRef.setInput('exercisesMade', []);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        historyService = TestBed.inject(HistoryService);
    }

    afterEach(() => {
        httpMock.verify();
    });

    it('loads today\'s history for the current exercise on init', () => {
        createComponent();

        fixture.detectChanges();
        const req = httpMock.expectOne(r => r.url === `${ historyService.historyUrl }/today/1/5`);
        expect(req.request.params.keys().length).toBe(0);
        req.flush([{ id: 1, weight: 60, reps: 8 }]);

        expect(component.exercisesMade()).toEqual([{ id: 1, weight: 60, reps: 8, restTime: '/' }]);
    });

    it('passes gymId as a query param when provided', () => {
        createComponent();
        fixture.componentRef.setInput('gymId', 3);

        fixture.detectChanges();
        const req = httpMock.expectOne(r => r.url === `${ historyService.historyUrl }/today/1/5`);
        expect(req.request.params.get('gymId')).toBe('3');
        req.flush([]);
    });

    it('shows an error alert when loading today\'s history fails', () => {
        createComponent();
        const alertService = TestBed.inject(AlertService);

        fixture.detectChanges();
        httpMock.expectOne(`${ historyService.historyUrl }/today/1/5`)
            .flush('error', { status: 500, statusText: 'Server error' });

        expect(alertService.alert()?.severity).toBe('error');
    });

    it('reloads the history when the exerciseId input changes', () => {
        createComponent();
        fixture.detectChanges();
        httpMock.expectOne(`${ historyService.historyUrl }/today/1/5`).flush([]);

        fixture.componentRef.setInput('exerciseId', 6);
        fixture.detectChanges();

        httpMock.expectOne(`${ historyService.historyUrl }/today/1/6`).flush([]);
    });

    it('does nothing when muscleGroupId changes without the exercise changing', () => {
        createComponent();
        fixture.detectChanges();
        httpMock.expectOne(`${ historyService.historyUrl }/today/1/5`).flush([]);

        fixture.componentRef.setInput('muscleGroupId', 2);
        fixture.detectChanges();

        httpMock.expectNone(`${ historyService.historyUrl }/today/2/5`);
    });

    it('onWeightChange() rounds the weight to the nearest half unit without saving', () => {
        createComponent();
        fixture.detectChanges();
        httpMock.expectOne(`${ historyService.historyUrl }/today/1/5`).flush([]);

        const history: History = { id: 1 };
        component['onWeightChange'](history, 61.3);

        expect(history.weight).toBe(61.5);
    });

    it('onRepsChange() updates the reps without saving', () => {
        createComponent();
        fixture.detectChanges();
        httpMock.expectOne(`${ historyService.historyUrl }/today/1/5`).flush([]);

        const history: History = { id: 1 };
        component['onRepsChange'](history, 12);

        expect(history.reps).toBe(12);
    });

    describe('toggleUnilateral()', () => {
        beforeEach(() => {
            createComponent();
            fixture.detectChanges();
            httpMock.expectOne(`${ historyService.historyUrl }/today/1/5`).flush([]);
        });

        it('flips and saves the unilateral flag', () => {
            const history: History = { id: 1, unilateral: false };

            component['toggleUnilateral'](history);

            expect(history.unilateral).toBe(true);
            httpMock.expectOne(`${ historyService.historyUrl }/1`).flush(history);
        });
    });

    describe('updateHistory()', () => {
        beforeEach(() => {
            createComponent();
            fixture.detectChanges();
            httpMock.expectOne(`${ historyService.historyUrl }/today/1/5`).flush([]);
        });

        it('shows a success alert when the update succeeds', () => {
            const alertService = TestBed.inject(AlertService);
            const history: History = { id: 1, weight: 60 };

            component['updateHistory'](history, true);

            expect(history.unilateral).toBe(true);
            httpMock.expectOne(`${ historyService.historyUrl }/1`).flush(history);

            expect(alertService.alert()?.severity).toBe('success');
        });

        it('shows an error alert when the update fails', () => {
            const alertService = TestBed.inject(AlertService);

            component['updateHistory']({ id: 1, weight: 60 });

            httpMock.expectOne(`${ historyService.historyUrl }/1`)
                .flush('error', { status: 500, statusText: 'Server error' });

            expect(alertService.alert()?.severity).toBe('error');
        });
    });

    describe('deleteHistory()', () => {
        beforeEach(() => {
            createComponent();
            fixture.detectChanges();
            httpMock.expectOne(`${ historyService.historyUrl }/today/1/5`)
                .flush([{ id: 1 }, { id: 2 }]);
        });

        it('removes the history entry and keeps the rest when some remain', () => {
            let resetEmitted = false;
            component.resetWorkout.subscribe(() => resetEmitted = true);

            component['deleteHistory']({ id: 1 });

            httpMock.expectOne(`${ historyService.historyUrl }/1`).flush(null);

            expect(component.exercisesMade()).toEqual([{ id: 2, restTime: '/' }]);
            expect(resetEmitted).toBe(false);
        });

        it('emits resetWorkout once every history entry has been removed', () => {
            let resetEmitted = false;
            component.resetWorkout.subscribe(() => resetEmitted = true);

            component['deleteHistory']({ id: 1 });
            httpMock.expectOne(`${ historyService.historyUrl }/1`).flush(null);
            component['deleteHistory']({ id: 2 });
            httpMock.expectOne(`${ historyService.historyUrl }/2`).flush(null);

            expect(component.exercisesMade()).toEqual([]);
            expect(resetEmitted).toBe(true);
        });

        it('shows an error alert when the deletion fails', () => {
            const alertService = TestBed.inject(AlertService);

            component['deleteHistory']({ id: 1 });

            httpMock.expectOne(`${ historyService.historyUrl }/1`)
                .flush('error', { status: 500, statusText: 'Server error' });

            expect(alertService.alert()?.severity).toBe('error');
        });
    });
});

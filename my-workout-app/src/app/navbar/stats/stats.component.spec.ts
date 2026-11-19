import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { StatsComponent } from './stats.component';
import { HistoryService } from '../../services/history.service';
import { AlertService } from '../../services/alert.service';
import { UserExercisesCountTotalWorkout } from '../../../interfaces/UserExercisesCountTotalWorkout';

describe('StatsComponent', () => {
    let fixture: ComponentFixture<StatsComponent>;
    let component: StatsComponent;
    let httpMock: HttpTestingController;
    let historyService: HistoryService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [StatsComponent],
            providers: [provideHttpClient(), provideHttpClientTesting()]
        });

        fixture = TestBed.createComponent(StatsComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        historyService = TestBed.inject(HistoryService);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('loads the global stats on init', () => {
        const stats: UserExercisesCountTotalWorkout = { countTotalDaysWorkout: 12, exercises: [] };

        fixture.detectChanges();
        httpMock.expectOne(`${ historyService.historyUrl }/stats`).flush(stats);

        expect(component.userExercisesCountTotalWorkout).toEqual(stats);
    });

    it('shows an error alert when the stats fail to load', () => {
        const alertService = TestBed.inject(AlertService);

        fixture.detectChanges();
        httpMock.expectOne(`${ historyService.historyUrl }/stats`)
            .flush('error', { status: 500, statusText: 'Server error' });

        expect(alertService.alert()?.severity).toBe('error');
    });
});

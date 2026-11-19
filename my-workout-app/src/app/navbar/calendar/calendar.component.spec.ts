import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CalendarComponent } from './calendar.component';
import { WorkoutService } from '../../services/workout.service';
import { AlertService } from '../../services/alert.service';
import { Workout } from '../../../interfaces/Workout';

describe('CalendarComponent', () => {
    let fixture: ComponentFixture<CalendarComponent>;
    let component: CalendarComponent;
    let httpMock: HttpTestingController;
    let workoutService: WorkoutService;

    const workouts: Workout[] = [
        { id: 1, date: new Date(2026, 0, 5), muscleGroup: { id: 1, name: 'pectoraux' } }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CalendarComponent],
            providers: [provideHttpClient(), provideHttpClientTesting()]
        });

        fixture = TestBed.createComponent(CalendarComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        workoutService = TestBed.inject(WorkoutService);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('shows the loading skeleton until the month data arrives', () => {
        fixture.detectChanges();

        expect(component.loading).toBe(true);

        httpMock.expectOne(r => r.url === `${ workoutService.workoutUrl }/date`).flush(workouts);

        expect(component.loading).toBe(false);
        expect(component.workouts).toEqual(workouts);
    });

    it('stops showing the loading skeleton when the month data fails to load', () => {
        fixture.detectChanges();
        const alertService = TestBed.inject(AlertService);

        httpMock.expectOne(r => r.url === `${ workoutService.workoutUrl }/date`)
            .flush('error', { status: 500, statusText: 'Server error' });

        expect(component.loading).toBe(false);
        expect(alertService.alert()?.severity).toBe('error');
    });

    it('does not show the loading skeleton again when navigating to another month', () => {
        fixture.detectChanges();
        httpMock.expectOne(r => r.url === `${ workoutService.workoutUrl }/date`).flush(workouts);

        component['nextMonth']();

        expect(component.loading).toBe(false);
        httpMock.expectOne(r => r.url === `${ workoutService.workoutUrl }/date`).flush([]);
    });
});

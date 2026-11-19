import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { RestTimeBannerComponent } from './rest-time-banner.component';
import { RestTimeService } from '../../services/rest-time.service';

@Component({ template: '', standalone: true })
class StubComponent {
}

describe('RestTimeBannerComponent', () => {
    let fixture: ComponentFixture<RestTimeBannerComponent>;
    let component: RestTimeBannerComponent;
    let router: Router;
    let restTimeService: RestTimeService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RestTimeBannerComponent],
            providers: [provideRouter([{ path: '**', component: StubComponent }])]
        });

        fixture = TestBed.createComponent(RestTimeBannerComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        restTimeService = TestBed.inject(RestTimeService);
        fixture.detectChanges();
    });

    it('hides the banner while on the workout-session page', async () => {
        await router.navigateByUrl('/workout/workout-session/1');
        fixture.detectChanges();

        expect(component['showBanner']()).toBe(false);
    });

    it('shows the banner on any other page once a rest timer is running', async () => {
        await router.navigateByUrl('/calendar');
        restTimeService.restTime.set({ minutes: 0, seconds: 5, centiseconds: 0 });
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.rest-banner')).toBeTruthy();
    });

    it('does not show the banner when no timer is running, even off the workout-session page', async () => {
        await router.navigateByUrl('/calendar');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.rest-banner')).toBeFalsy();
    });

    it('stopTimer() stops the underlying rest timer', () => {
        const stopSpy = vi.spyOn(restTimeService, 'stopTimer');

        component['stopTimer']();

        expect(stopSpy).toHaveBeenCalledOnce();
    });

    it('redirectToWorkout() navigates back to the in-progress workout session', () => {
        restTimeService.saveRestTimeInfo({ muscleGroup: 2, tab: 3 });
        const navigateSpy = vi.spyOn(router, 'navigate');

        component['redirectToWorkout']();

        expect(navigateSpy).toHaveBeenCalledWith(['workout', 'workout-session', 2], { queryParams: { tab: 3 } });
    });

    it('redirectToWorkout() does nothing when there is no saved session to resume', () => {
        const navigateSpy = vi.spyOn(router, 'navigate');

        component['redirectToWorkout']();

        expect(navigateSpy).not.toHaveBeenCalled();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertComponent } from './alert.component';
import { AlertService } from '../../services/alert.service';

describe('AlertComponent', () => {
    let fixture: ComponentFixture<AlertComponent>;
    let alertService: AlertService;

    beforeEach(() => {
        vi.useFakeTimers();

        TestBed.configureTestingModule({
            imports: [AlertComponent]
        });

        fixture = TestBed.createComponent(AlertComponent);
        alertService = TestBed.inject(AlertService);
        fixture.detectChanges();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('shows nothing when there is no alert', () => {
        expect(fixture.nativeElement.textContent.trim()).toBe('');
    });

    it('displays the current alert', () => {
        alertService.show({ severity: 'success', message: 'Saved' });
        fixture.detectChanges();

        expect(fixture.nativeElement.textContent).toContain('Saved');
    });

    it('automatically hides the alert after 4 seconds', () => {
        alertService.show({ severity: 'success', message: 'Saved' });
        fixture.detectChanges();

        vi.advanceTimersByTime(4000);

        expect(alertService.alert()).toBeNull();
    });

    it('restarts the auto-hide timer when a new alert arrives before the first one expires', () => {
        alertService.show({ severity: 'info', message: 'First' });
        fixture.detectChanges();

        vi.advanceTimersByTime(3000);
        alertService.show({ severity: 'info', message: 'Second' });
        fixture.detectChanges();

        vi.advanceTimersByTime(3000);

        // Only 3s have passed since "Second" was shown: it must still be visible.
        expect(alertService.alert()?.message).toBe('Second');

        vi.advanceTimersByTime(1000);

        expect(alertService.alert()).toBeNull();
    });
});

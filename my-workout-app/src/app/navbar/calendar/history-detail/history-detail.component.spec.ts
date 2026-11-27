import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HistoryDetailComponent } from './history-detail.component';
import { History } from '../../../../interfaces/History';

describe('HistoryDetailComponent', () => {
    let fixture: ComponentFixture<HistoryDetailComponent>;

    function render(histories: History[]) {
        TestBed.configureTestingModule({
            imports: [HistoryDetailComponent],
            providers: [provideRouter([])]
        });

        fixture = TestBed.createComponent(HistoryDetailComponent);
        fixture.componentRef.setInput('exercise', { id: 1, name: 'Squat' });
        fixture.componentRef.setInput('histories', histories);
        fixture.detectChanges();

        return fixture.nativeElement as HTMLElement;
    }

    it('shows the exercise name', () => {
        const el = render([]);

        expect(el.textContent).toContain('Squat');
    });

    it('shows reps and weight together, separated by an "x"', () => {
        const el = render([{ id: 1, reps: 8, weight: 60 }]);

        expect(el.textContent).toContain('8');
        expect(el.textContent).toContain('x');
        expect(el.textContent).toContain('60 kg');
    });

    it('uses the singular "répétition" for a single bodyweight rep', () => {
        const el = render([{ id: 1, reps: 1 }]);

        expect(el.textContent).toContain('répétition');
        expect(el.textContent).not.toContain('répétitions');
    });

    it('uses the plural "répétitions" for several bodyweight reps', () => {
        const el = render([{ id: 1, reps: 3 }]);

        expect(el.textContent).toContain('répétitions');
    });

    it('shows the unilateral marker when set', () => {
        const el = render([{ id: 1, reps: 8, weight: 20, unilateral: true }]);

        expect(el.textContent).toContain('unilatéral');
    });

    it('shows the duration for a timed exercise without reps or weight', () => {
        const el = render([{ id: 1, duration: 45 }]);

        expect(el.textContent).toContain('45 mn');
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
    let fixture: ComponentFixture<ConfirmDialogComponent>;
    let component: ConfirmDialogComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ConfirmDialogComponent]
        });

        fixture = TestBed.createComponent(ConfirmDialogComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('open', true);
        fixture.componentRef.setInput('message', 'Are you sure?');
    });

    it('renders nothing when closed', () => {
        fixture.componentRef.setInput('open', false);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.confirm-backdrop')).toBeNull();
    });

    it('renders the message when open', () => {
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.confirm-card p').textContent).toContain('Are you sure?');
    });

    it('emits confirmed when the confirm button is clicked', () => {
        fixture.detectChanges();
        let emitted = false;
        component.confirmed.subscribe(() => emitted = true);

        const buttons = fixture.nativeElement.querySelectorAll('.confirm-actions button');
        buttons[1].click();

        expect(emitted).toBe(true);
    });

    it('emits cancelled when the cancel button or the backdrop is clicked', () => {
        fixture.detectChanges();
        let cancelCount = 0;
        component.cancelled.subscribe(() => cancelCount++);

        fixture.nativeElement.querySelector('.confirm-actions button').click();
        fixture.nativeElement.querySelector('.confirm-backdrop').click();

        expect(cancelCount).toBe(2);
    });

    it('emits cancelled on Escape only while open', () => {
        fixture.detectChanges();
        let cancelled = false;
        component.cancelled.subscribe(() => cancelled = true);

        fixture.componentRef.setInput('open', false);
        fixture.detectChanges();
        component.onEscape();
        expect(cancelled).toBe(false);

        fixture.componentRef.setInput('open', true);
        fixture.detectChanges();
        component.onEscape();
        expect(cancelled).toBe(true);
    });
});

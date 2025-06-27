import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PectorauxComponent } from './pectoraux.component';

describe('LegsComponent', () => {
    let component: PectorauxComponent;
    let fixture: ComponentFixture<PectorauxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PectorauxComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PectorauxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

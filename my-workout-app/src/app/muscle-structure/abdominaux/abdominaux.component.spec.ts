import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbdominauxComponent } from './abdominaux.component';

describe('AbdominauxComponent', () => {
    let component: AbdominauxComponent;
    let fixture: ComponentFixture<AbdominauxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AbdominauxComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AbdominauxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EpaulesComponent } from './epaules.component';

describe('EpaulesComponent', () => {
    let component: EpaulesComponent;
    let fixture: ComponentFixture<EpaulesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EpaulesComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EpaulesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

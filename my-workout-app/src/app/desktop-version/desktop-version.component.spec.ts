import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DesktopVersionComponent } from './desktop-version.component';

describe('DesktopVersionComponent', () => {
    let component: DesktopVersionComponent;
    let fixture: ComponentFixture<DesktopVersionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DesktopVersionComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DesktopVersionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

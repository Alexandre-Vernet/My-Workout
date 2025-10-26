import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogSelectCardioExerciseComponent } from './dialog-select-cardio-exercise.component';

describe('DialogSelectCardioExerciseComponent', () => {
    let component: DialogSelectCardioExerciseComponent;
    let fixture: ComponentFixture<DialogSelectCardioExerciseComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DialogSelectCardioExerciseComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DialogSelectCardioExerciseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

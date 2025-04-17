import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectMuscleGroupWorkoutComponent } from './select-muscle-group-workout.component';

describe('ListMusclesGroupsComponent', () => {
    let component: SelectMuscleGroupWorkoutComponent;
    let fixture: ComponentFixture<SelectMuscleGroupWorkoutComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SelectMuscleGroupWorkoutComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SelectMuscleGroupWorkoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

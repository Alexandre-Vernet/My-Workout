import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { switchMap, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ExerciseService } from '../../../exercise/exercise.service';
import { Step, StepList, StepPanel, StepPanels, Stepper } from 'primeng/stepper';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Exercise, ExerciseMade } from '../../../../../../../libs/interfaces/exercise';
import { InputNumber } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-workout-session',
    imports: [CommonModule, Stepper, StepList, Step, StepPanels, StepPanel, FormsModule, Button, InputNumber, TableModule],
    templateUrl: './workout-session.component.html',
    styleUrl: './workout-session.component.scss',
    standalone: true
})
export class WorkoutSessionComponent implements OnInit {

    exercises: Exercise[] = [];
    exercisesMade: ExerciseMade[] = [];

    activeStep: number = 1;

    weight: number = null;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly exerciseService: ExerciseService
    ) {
    }

    ngOnInit() {
        this.activatedRoute.params
            .pipe(
                take(1),
                switchMap((params: {
                    muscleGroupId: number
                }) => this.exerciseService.findExercisesByMuscleGroupIdAndUserId(Number(params.muscleGroupId)))
            )
            .subscribe(exercises => {
                this.exercises = exercises;
            });
    }

    saveExercise() {
        const exercise: ExerciseMade = {
            id: this.exercisesMade.length + 1,
            weight: this.weight
        }

        this.exercisesMade.push(exercise);
    }
}

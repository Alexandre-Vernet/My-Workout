import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { switchMap, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ExerciseService } from '../../../exercise/exercise.service';

@Component({
    selector: 'app-workout-session',
    imports: [CommonModule],
    templateUrl: './workout-session.component.html',
    styleUrl: './workout-session.component.scss',
    standalone: true
})
export class WorkoutSessionComponent implements OnInit {
    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly exerciseService: ExerciseService
    ) {
    }

    ngOnInit() {
        this.activatedRoute.params.pipe(
            take(1),
            switchMap((params: {
                muscleGroupId: number
            }) => this.exerciseService.findExercisesByMuscleGroupId(Number(params.muscleGroupId)))
        )
            .subscribe(exercises => {
                // Get user exercises
                console.log(exercises);
            });
    }
}

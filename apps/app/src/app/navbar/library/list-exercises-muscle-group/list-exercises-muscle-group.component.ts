import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseService } from '../../../exercise/exercise.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Exercise } from '../../../../../../../libs/interfaces/exercise';
import { switchMap, take } from 'rxjs';
import { DataView } from 'primeng/dataview';
import { WorkoutService } from '../../workout/workout.service';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';

@Component({
    selector: 'app-list-exercises',
    imports: [CommonModule, DataView, RouterLink, Button, Message],
    templateUrl: './list-exercises-muscle-group.component.html',
    styleUrl: './list-exercises-muscle-group.component.scss'
})
export class ListExercisesMuscleGroupComponent implements OnInit {

    exercises: Exercise[];

    errorMessage: string;

    constructor(
      private readonly route: ActivatedRoute,
      private readonly exerciseService: ExerciseService,
      private readonly workoutService: WorkoutService
    ) {
    }

    ngOnInit() {
        this.route.params.pipe(
          take(1),
          switchMap((params: { muscleGroupId: number }) => this.exerciseService.findExercisesByMuscleGroupId(Number(params.muscleGroupId)))
        )
          .subscribe(exercises => {
              this.exercises = exercises;
              this.sortExercises();
          });
    }

    toggleExerciseWorkout(exercise: Exercise) {
        return this.workoutService.toggleExerciseWorkout(exercise)
          .pipe(take(1))
          .subscribe({
              next: () => {
                  exercise.addedToWorkout = !exercise.addedToWorkout;
                  this.errorMessage = '';
              },
              error: (err) => this.errorMessage = err?.error?.message ?? 'Error while saving'
          });
    }

    private sortExercises() {
        return this.exercises.sort((a, b) => Number(b.name) - Number(a.name));
    }
}


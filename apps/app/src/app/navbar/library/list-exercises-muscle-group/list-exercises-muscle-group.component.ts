import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseService } from '../../../services/exercise.service';
import { ActivatedRoute } from '@angular/router';
import { Exercise } from '../../../../../../../libs/interfaces/exercise';
import { switchMap, take } from 'rxjs';
import { DataView } from 'primeng/dataview';
import { UserExerciseService } from '../../../services/user-exercise.service';
import { Button } from 'primeng/button';
import { MuscleGroup } from '../../../../../../../libs/interfaces/MuscleGroup';
import { Badge } from 'primeng/badge';
import { Skeleton } from 'primeng/skeleton';
import { AlertService } from '../../../services/alert.service';

@Component({
    selector: 'app-list-exercises',
    imports: [CommonModule, DataView, Button, Badge, Skeleton],
    templateUrl: './list-exercises-muscle-group.component.html',
    styleUrl: './list-exercises-muscle-group.component.scss'
})
export class ListExercisesMuscleGroupComponent implements OnInit {

    muscleGroup: MuscleGroup;
    exercises: Exercise[];

    isLoading = true;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly exerciseService: ExerciseService,
        private readonly userExerciseService: UserExerciseService,
        private readonly alertService: AlertService
    ) {
    }

    ngOnInit() {
        this.route.params.pipe(
            take(1),
            switchMap((params: {
                muscleGroupId: number
            }) => this.exerciseService.findAllExercisesByMuscleGroupId(Number(params.muscleGroupId)))
        )
            .subscribe({
                next: ({ exercises, muscleGroup }) => {
                    this.isLoading = false;
                    this.exercises = exercises;
                    this.muscleGroup = muscleGroup;
                    this.sortExercises();
                    this.alertService.alert$.next(null);
                },
                error: (err) => {
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Impossible d\'afficher la liste des exercises'
                    });
                }
            });
    }

    toggleExerciseWorkout(exercise: Exercise) {
        return this.userExerciseService.toggleExerciseWorkout(exercise)
            .pipe(take(1))
            .subscribe({
                next: () => {
                    exercise.addedToWorkout = !exercise.addedToWorkout;
                    this.alertService.alert$.next(null);
                },
                error: (err) => {
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Impossible d\'enregistrer cet exercice'
                    });
                }
            });
    }

    private sortExercises() {
        return this.exercises.sort((a, b) => Number(b.name) - Number(a.name));
    }
}


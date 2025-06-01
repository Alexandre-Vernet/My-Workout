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
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { UserExercise } from '../../../../../../../libs/interfaces/user-exercise';

@Component({
    selector: 'app-list-exercises',
    imports: [CommonModule, DataView, Button, Badge, Skeleton, DragDropModule],
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
        this.findAllExercisesByMuscleGroupId();
    }

    toggleExerciseWorkout(exercise: Exercise) {
        return this.userExerciseService.toggleExerciseWorkout(exercise)
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.findAllExercisesByMuscleGroupId();
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

    drop(event: CdkDragDrop<any[]>) {
        const dragged = this.exercises[event.previousIndex];
        const target = this.exercises[event.currentIndex];

        // Block movement between added and not added
        if (dragged.addedToWorkout !== target.addedToWorkout) {
            return;
        }

        moveItemInArray(this.exercises, event.previousIndex, event.currentIndex);

        const userExercises: UserExercise[] = [];

        this.exercises.forEach((e, index) => {
            const userExercise: UserExercise = {
                id: e.userExerciseId,
                exercise: e,
                order: index
            };

            userExercises.push(userExercise);
        });

        const userExercisesFilter = userExercises.filter(ue => ue.id !== null);

        this.userExerciseService.updateOrderExercises(userExercisesFilter)
            .pipe(take(1))
            .subscribe({
                error: (err) => {
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Impossible de mettre à jour l\'ordre des exercises'
                    });
                }
            });
    }

    private findAllExercisesByMuscleGroupId() {
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


    private sortExercises() {
        return this.exercises.sort((a, b) => {
            // 1. Order by addedToWorkout
            if (a.addedToWorkout !== b.addedToWorkout) {
                return a.addedToWorkout ? -1 : 1;
            }

            // 2. Order by "order" field
            if (a.order !== b.order) {
                return a.order - b.order;
            }

            // 3. Order by id
            return a.id - b.id;
        });
    }
}


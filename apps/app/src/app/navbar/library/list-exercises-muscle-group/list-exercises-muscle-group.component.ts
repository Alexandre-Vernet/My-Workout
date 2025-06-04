import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseService } from '../../../services/exercise.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Exercise } from '../../../../../../../libs/interfaces/exercise';
import { switchMap } from 'rxjs';
import { DataView } from 'primeng/dataview';
import { UserExerciseService } from '../../../services/user-exercise.service';
import { Button } from 'primeng/button';
import { MuscleGroup } from '../../../../../../../libs/interfaces/MuscleGroup';
import { Badge } from 'primeng/badge';
import { Skeleton } from 'primeng/skeleton';
import { AlertService } from '../../../services/alert.service';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { UserExercise } from '../../../../../../../libs/interfaces/user-exercise';
import { Tag } from 'primeng/tag';
import { Muscle } from '../../../../../../../libs/interfaces/muscle';

@Component({
    selector: 'app-list-exercises',
    imports: [CommonModule, DataView, Button, Badge, Skeleton, DragDropModule, RouterLink, Tag],
    templateUrl: './list-exercises-muscle-group.component.html',
    styleUrl: './list-exercises-muscle-group.component.scss'
})
export class ListExercisesMuscleGroupComponent implements OnInit {

    muscleGroup: MuscleGroup;
    exercises: Exercise[];
    filteredExercises: Exercise[];

    muscles: Muscle[] = [];
    activeFilter: number = null;

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
            .subscribe({
                error: (err) => {
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Impossible de mettre à jour l\'ordre des exercises'
                    });
                }
            });
    }

    filterByMuscle(muscle: Muscle) {
        // Reset filter
        if (muscle.id === this.activeFilter) {
            this.filteredExercises = this.exercises;
            this.activeFilter = null;
            return;
        }

        this.filteredExercises = this.exercises.filter(e => e.muscles.some(m => m.id === muscle.id));
        this.activeFilter = muscle.id;
    }

    private findAllExercisesByMuscleGroupId() {
        this.route.params.pipe(
            switchMap((params: {
                muscleGroupId: number
            }) => this.exerciseService.findAllExercisesByMuscleGroupId(Number(params.muscleGroupId)))
        )
            .subscribe({
                next: ({ exercises, muscleGroup }) => {
                    this.isLoading = false;
                    this.exercises = exercises.sort(this.sortExercises);
                    this.filteredExercises = exercises.sort(this.sortExercises);
                    this.muscleGroup = muscleGroup;
                    this.getMuscles();
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


    private sortExercises(a: Exercise, b: Exercise) {
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
    }

    private getMuscles() {
        this.exercises.forEach(exercise => {
            exercise.muscles.forEach(muscle => {
                if (!this.muscles.some(m => m.id === muscle.id)) {
                    this.muscles.push(muscle);
                }
            });
        });
    }
}


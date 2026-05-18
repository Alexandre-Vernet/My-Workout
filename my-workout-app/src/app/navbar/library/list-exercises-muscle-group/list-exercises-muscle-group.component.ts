import { Component, OnInit } from '@angular/core';
import { ExerciseService } from '../../../services/exercise.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { UserExerciseService } from '../../../services/user-exercise.service';
import { Button } from 'primeng/button';
import { Badge } from 'primeng/badge';
import { Skeleton } from 'primeng/skeleton';
import { AlertService } from '../../../services/alert.service';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Tag } from 'primeng/tag';
import { Muscle } from '../../../../interfaces/Muscle';
import { removeAccents, replaceSpaces } from '../../../shared/utils/remove-accents';
import { NgClass, UpperCasePipe } from '@angular/common';
import { MuscleGroupExercises } from '../../../../interfaces/MuscleGroupExercises';
import { ExerciseAddedToWorkout } from "../../../../interfaces/ExerciseAddedToWorkout";

@Component({
    selector: 'app-list-exercises',
    imports: [Button, Badge, Skeleton, DragDropModule, RouterLink, Tag, NgClass, UpperCasePipe],
    templateUrl: './list-exercises-muscle-group.component.html',
    styleUrl: './list-exercises-muscle-group.component.scss'
})
export class ListExercisesMuscleGroupComponent implements OnInit {

    muscleGroupExercises: MuscleGroupExercises;
    filterMuscleGroupExercises: MuscleGroupExercises;

    activeFilter: number = null;

    protected readonly replaceSpaces = replaceSpaces;
    protected readonly removeAccents = removeAccents;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly exerciseService: ExerciseService,
        private readonly userExerciseService: UserExerciseService,
        private readonly alertService: AlertService
    ) {
    }

    ngOnInit() {
        this.findAllExercisesByMuscleGroupId();
    }

    toggleExerciseWorkout(exerciseAddedToWorkout: ExerciseAddedToWorkout) {
        this.userExerciseService.toggleExerciseWorkout(exerciseAddedToWorkout.exercise)
            .subscribe({
                next: () => {
                    this.findAllExercisesByMuscleGroupId();
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
        const dragged = this.muscleGroupExercises.exerciseAddedToWorkouts[event.previousIndex];
        const target = this.muscleGroupExercises.exerciseAddedToWorkouts[event.currentIndex];

        // Block movement between added and not added
        if (dragged.addedToWorkout !== target.addedToWorkout) {
            return;
        }

        moveItemInArray(this.muscleGroupExercises.exerciseAddedToWorkouts, event.previousIndex, event.currentIndex);

        const userExercises = this.muscleGroupExercises.exerciseAddedToWorkouts
            .filter(e => e.addedToWorkout)
            .map((exerciseAddedWorkout, index) => ({
                exercise: { id: exerciseAddedWorkout.exercise.id },
                order: index
            }));


        this.userExerciseService.updateOrderExercises(userExercises)
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
            this.filterMuscleGroupExercises.exerciseAddedToWorkouts = [
                ...this.muscleGroupExercises.exerciseAddedToWorkouts
            ];
            this.activeFilter = null;
            return;
        }

        this.filterMuscleGroupExercises.exerciseAddedToWorkouts =
            this.muscleGroupExercises.exerciseAddedToWorkouts.filter(exercise =>
                exercise.muscles.some(m => m.id === muscle.id)
            );

        this.activeFilter = muscle.id;
    }

    private findAllExercisesByMuscleGroupId() {
        this.route.params
            .pipe(
                switchMap((params: {
                    muscleGroupId: number
                }) => this.exerciseService.findAllExercises(Number(params.muscleGroupId)))
            )
            .subscribe({
                next: (muscleGroupExercises) => {
                    this.muscleGroupExercises = muscleGroupExercises;
                    this.filterMuscleGroupExercises = {
                        ...muscleGroupExercises,
                        exerciseAddedToWorkouts: [...muscleGroupExercises.exerciseAddedToWorkouts]
                    };
                },
                error: () => this.router.navigate(['not-found'])
            });
    }
}


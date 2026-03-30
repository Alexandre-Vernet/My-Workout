import { Component, OnInit } from '@angular/core';
import { ExerciseService } from '../../../services/exercise.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Exercise } from '../../../../interfaces/Exercise';
import { switchMap } from 'rxjs';
import { DataView } from 'primeng/dataview';
import { UserExerciseService } from '../../../services/user-exercise.service';
import { Button } from 'primeng/button';
import { Badge } from 'primeng/badge';
import { Skeleton } from 'primeng/skeleton';
import { AlertService } from '../../../services/alert.service';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { UserExercise } from '../../../../interfaces/User-exercise';
import { Tag } from 'primeng/tag';
import { Muscle } from '../../../../interfaces/Muscle';
import { removeAccents, replaceSpaces } from '../../../shared/utils/remove-accents';
import { NgClass, UpperCasePipe } from '@angular/common';
import { MuscleGroupExercises } from '../../../../interfaces/MuscleGroupExercises';

@Component({
    selector: 'app-list-exercises',
    imports: [DataView, Button, Badge, Skeleton, DragDropModule, RouterLink, Tag, NgClass, UpperCasePipe],
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
        const dragged = this.muscleGroupExercises.exerciseAddedToWorkouts[event.previousIndex];
        const target = this.muscleGroupExercises.exerciseAddedToWorkouts[event.currentIndex];

        // Block movement between added and not added
        if (dragged.addedToWorkout !== target.addedToWorkout) {
            return;
        }

        moveItemInArray(this.muscleGroupExercises.exerciseAddedToWorkouts, event.previousIndex, event.currentIndex);

        const userExercises: UserExercise[] = [];

        this.muscleGroupExercises.exerciseAddedToWorkouts.forEach((e, index) => {
            const userExercise: UserExercise = {
                // id: e.userExerciseId,
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
            this.filterMuscleGroupExercises = this.muscleGroupExercises;
            this.activeFilter = null;
            return;
        }

        // this.filterMuscleGroupExercises.exerciseAddedToWorkouts = this.muscleGroupExercises.exerciseAddedToWorkouts
        //     .filter(e => e.exercise.exerciseMuscles.some(m => m.muscles.id === muscle.id));
        this.activeFilter = muscle.id;
    }

    private findAllExercisesByMuscleGroupId() {
        this.route.params
            .pipe(
                switchMap((params: {
                    muscleGroupId: number
                }) => this.exerciseService.findAllExercisesByMuscleGroupId(Number(params.muscleGroupId)))
            )
            .subscribe({
                next: (muscleGroupExercises) => {
                    this.muscleGroupExercises = muscleGroupExercises;
                    this.filterMuscleGroupExercises = muscleGroupExercises;
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
}


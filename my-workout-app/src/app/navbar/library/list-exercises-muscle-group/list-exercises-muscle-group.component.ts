import { Component, OnInit } from '@angular/core';
import { ExerciseService } from '../../../services/exercise.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Exercise } from '../../../../interfaces/exercise';
import { switchMap } from 'rxjs';
import { DataView } from 'primeng/dataview';
import { UserExerciseService } from '../../../services/user-exercise.service';
import { Button } from 'primeng/button';
import { MuscleGroup } from '../../../../interfaces/MuscleGroup';
import { Badge } from 'primeng/badge';
import { Skeleton } from 'primeng/skeleton';
import { AlertService } from '../../../services/alert.service';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { UserExercise } from '../../../../interfaces/user-exercise';
import { Tag } from 'primeng/tag';
import { Muscle } from '../../../../interfaces/muscle';
import { removeAccents, replaceSpaces } from '../../../shared/utils/remove-accents';
import { NgClass, UpperCasePipe } from '@angular/common';
import { MuscleGroupExercises } from '../../../../interfaces/MuscleGroupExercises';
import { ExerciseAddedToWorkout } from '../../../../interfaces/ExerciseAddedToWorkout';

@Component({
    selector: 'app-list-exercises',
    imports: [DataView, Button, Badge, Skeleton, DragDropModule, RouterLink, Tag, NgClass, UpperCasePipe],
    templateUrl: './list-exercises-muscle-group.component.html',
    styleUrl: './list-exercises-muscle-group.component.scss'
})
export class ListExercisesMuscleGroupComponent implements OnInit {

    muscleGroupExercises: MuscleGroupExercises;
    filterMuscleGroupExercises: MuscleGroupExercises;

    muscles: Muscle[] = [];
    activeFilter: number = null;

    isLoading = true;

    protected readonly replaceSpaces = replaceSpaces;

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
        const dragged = this.muscleGroupExercises.exerciseAddedToWorkoutList[event.previousIndex];
        const target = this.muscleGroupExercises.exerciseAddedToWorkoutList[event.currentIndex];

        // Block movement between added and not added
        if (dragged.addedToWorkout !== target.addedToWorkout) {
            return;
        }

        moveItemInArray(this.muscleGroupExercises.exerciseAddedToWorkoutList, event.previousIndex, event.currentIndex);

        const userExercises: UserExercise[] = [];

        this.muscleGroupExercises.exerciseAddedToWorkoutList.forEach((e, index) => {
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

        this.filterMuscleGroupExercises.exerciseAddedToWorkoutList = this.muscleGroupExercises.exerciseAddedToWorkoutList.filter(e => e.exercise.muscleList.some(m => m.id === muscle.id));
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
                    console.log(muscleGroupExercises);
                    this.isLoading = false;
                    this.muscleGroupExercises.exerciseAddedToWorkoutList = muscleGroupExercises.exerciseAddedToWorkoutList.sort(this.sortExercises);
                    this.filterMuscleGroupExercises.exerciseAddedToWorkoutList = muscleGroupExercises.exerciseAddedToWorkoutList.sort(this.sortExercises);
                    this.filterMuscleGroupExercises.muscleGroup = muscleGroupExercises.muscleGroup;
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


    private sortExercises(a: ExerciseAddedToWorkout, b: ExerciseAddedToWorkout) {
        // 1. Order by addedToWorkout
        if (a.addedToWorkout !== b.addedToWorkout) {
            return a.addedToWorkout ? -1 : 1;
        }

        // 2. Order by "order" field
        if (a.order !== b.order) {
            return a.order - b.order;
        }

        // 3. Order by id
        return a.exercise.id - b.exercise.id;
    }

    private getMuscles() {
        this.muscleGroupExercises.exerciseAddedToWorkoutList.forEach(exercise => {
            exercise.exercise.exerciseMuscleList.forEach(exerciseMuscle => {
                if (!this.muscles.some(m => m.id === exerciseMuscle.muscle.id)) {
                    this.muscles.push(exerciseMuscle.muscle);
                }
            });
        });
    }

    protected readonly removeAccents = removeAccents;
}


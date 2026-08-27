import { Component, OnInit } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';
import { AlertService } from '../../../services/alert.service';
import { InputText } from "primeng/inputtext";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MuscleGroupEnum } from "../../../../interfaces/MuscleGroupEnum";
import { FirstLetterUppercasePipe } from "../../../shared/pipes/first-letter-uppercase.pipe";
import { ExerciseService } from "../../../services/exercise.service";
import { Exercise } from "../../../../interfaces/Exercise";
import { RouterLink } from "@angular/router";
import { debounceTime, of, switchMap } from "rxjs";
import { PlurialPipe } from "../../../shared/pipes/plurial.pipe";

@Component({
    selector: 'app-list-exercises',
    imports: [Skeleton, InputText, FormsModule, FirstLetterUppercasePipe, RouterLink, ReactiveFormsModule, PlurialPipe],
    templateUrl: './list-exercises.component.html',
    styleUrl: './list-exercises.component.scss',
    standalone: true
})
export class ListExercisesComponent implements OnInit {

    exercises: Exercise[];
    filterExercises: Exercise[];
    muscleGroupEnum = Object.entries(MuscleGroupEnum)
        .filter(([key]) => isNaN(Number(key)))
        .sort()
        .map(([label, value]) => ({
            label,
            id: value as MuscleGroupEnum
        }));
    selectedMuscleGroup: number;

    searchExercise = new FormControl();

    constructor(
        private readonly exerciseService: ExerciseService,
        private readonly alertService: AlertService
    ) {
    }

    ngOnInit() {
        this.exerciseService.findAll()
            .subscribe({
                next: (exercises) => {
                    this.exercises = exercises;
                    this.filterExercises = exercises;
                },
                error: (err) => {
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Impossible d\'afficher la bibliothèque d\'exercices'
                    });
                }
            });

        this.searchExercise.valueChanges
            .pipe(
                debounceTime(300),
                switchMap((value: string) => {
                    if (!value || value.length === 0) {
                        return of(this.exercises);
                    }

                    if (value.length < 3) {
                        return of(this.filterExercises);
                    }

                    return this.exerciseService.search(value);
                })
            )
            .subscribe((exercises) => {
                this.filterExercises = exercises;
                this.selectedMuscleGroup = null;
            })
    }

    protected filterExercise(muscleGroupEnum: number) {
        if (this.selectedMuscleGroup === muscleGroupEnum) {
            this.filterExercises = this.exercises;
            this.selectedMuscleGroup = null;
            return;
        }
        this.selectedMuscleGroup = muscleGroupEnum;
        this.exerciseService.findExercisesByMuscleGroup(muscleGroupEnum)
            .subscribe({
                next: (exercises) => this.filterExercises = exercises,
                error: (err) => {
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Impossible d\'afficher la bibliothèque d\'exercices'
                    });
                }
            });
    }
}

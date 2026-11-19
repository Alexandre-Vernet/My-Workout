import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';
import { AlertService } from '../../../services/alert.service';
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MuscleGroupEnum } from "../../../../interfaces/MuscleGroupEnum";
import { FirstLetterUppercasePipe } from "../../../shared/pipes/first-letter-uppercase.pipe";
import { ExerciseService } from "../../../services/exercise.service";
import { Exercise } from "../../../../interfaces/Exercise";
import { ActivatedRoute, RouterLink, RouterOutlet } from "@angular/router";
import { debounceTime, of, switchMap } from "rxjs";
import { PluralPipe } from "../../../shared/pipes/plural.pipe";
import { getMuscleGroupColor, getMuscleGroupLabel } from "../../../shared/utils/muscle-group-color";

interface ExerciseGroup {
    readonly label: string;
    readonly color: string;
    readonly exercises: readonly Exercise[];
}

@Component({
    selector: 'app-list-exercises',
    imports: [Skeleton, FormsModule, FirstLetterUppercasePipe, RouterLink, RouterOutlet, ReactiveFormsModule, PluralPipe],
    templateUrl: './list-exercises.component.html',
    styleUrl: './list-exercises.component.scss',
    standalone: true
})
export class ListExercisesComponent implements OnInit {

    // The exercise detail is a nested route rendered as a sliding overlay (see
    // app.routes.ts): these mirror the child <router-outlet>'s activation state so the
    // overlay's visibility/animation and the body scroll lock stay in sync with it.
    protected readonly detailOpen = signal(false);

    exercises: Exercise[] = [];
    filterExercises: Exercise[] = [];
    muscleGroupEnum = Object.entries(MuscleGroupEnum)
        .filter(([key]) => isNaN(Number(key)))
        .sort()
        .map(([label, value]) => ({
            label,
            id: value as MuscleGroupEnum
        }));
    selectedMuscleGroup: number | null = null;
    loading = true;

    searchExercise = new FormControl();

    private readonly exerciseService = inject(ExerciseService);
    private readonly alertService = inject(AlertService);
    private readonly route = inject(ActivatedRoute);

    constructor() {
        effect(() => {
            document.body.style.overflow = this.detailOpen() ? 'hidden' : '';
        });

        inject(DestroyRef).onDestroy(() => {
            document.body.style.overflow = '';
        });
    }

    ngOnInit() {
        this.exerciseService.findAll()
            .subscribe({
                next: (exercises) => {
                    this.exercises = exercises;
                    this.filterExercises = exercises;
                    this.loading = false;
                    this.applyMuscleGroupFromQueryParams();
                },
                error: (err) => {
                    this.loading = false;
                    this.alertService.show({
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
                    this.alertService.show({
                        severity: 'error',
                        message: err?.error?.message ?? 'Impossible d\'afficher la bibliothèque d\'exercices'
                    });
                }
            });
    }

    // Groups exercises by muscle group for the default browsing view (carousels per
    // group). Only used when neither a search nor a muscle group filter is active.
    protected get isBrowsing(): boolean {
        return this.selectedMuscleGroup === null && !this.searchExercise.value;
    }

    protected get groupedExercises(): ExerciseGroup[] {
        const exercisesByGroupName = new Map<string, Exercise[]>();

        for (const exercise of this.filterExercises) {
            const muscleGroupName = exercise.muscles?.[0]?.muscleGroup?.name ?? '';
            const exercisesInGroup = exercisesByGroupName.get(muscleGroupName) ?? [];
            exercisesInGroup.push(exercise);
            exercisesByGroupName.set(muscleGroupName, exercisesInGroup);
        }

        return [...exercisesByGroupName.entries()]
            .map(([muscleGroupName, exercisesInGroup]) => ({
                label: getMuscleGroupLabel(muscleGroupName),
                color: getMuscleGroupColor(muscleGroupName),
                exercises: exercisesInGroup
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }

    protected groupLabel(exercise: Exercise): string {
        return getMuscleGroupLabel(exercise.muscles?.[0]?.muscleGroup?.name);
    }

    protected groupColor(exercise: Exercise): string {
        return getMuscleGroupColor(exercise.muscles?.[0]?.muscleGroup?.name);
    }

    protected cardGradient(exercise: Exercise): string {
        const color = this.groupColor(exercise);
        return `linear-gradient(160deg, ${ color }, ${ color }99)`;
    }

    protected onDetailActivate() {
        this.detailOpen.set(true);
    }

    protected onDetailDeactivate() {
        this.detailOpen.set(false);
    }

    private applyMuscleGroupFromQueryParams() {
        const muscleGroupParam = this.route.snapshot.queryParamMap.get('muscleGroup');
        if (muscleGroupParam) {
            this.filterExercise(Number(muscleGroupParam));
        }
    }
}

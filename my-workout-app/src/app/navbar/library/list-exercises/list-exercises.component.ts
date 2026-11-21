import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { AlertService } from '../../../services/alert.service';
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MuscleGroupEnum } from "../../../../interfaces/MuscleGroupEnum";
import { FirstLetterUppercasePipe } from "../../../shared/pipes/first-letter-uppercase.pipe";
import { ExerciseService } from "../../../services/exercise.service";
import { Exercise } from "../../../../interfaces/Exercise";
import { ActivatedRoute, RouterLink, RouterOutlet } from "@angular/router";
import { debounceTime, of, switchMap } from "rxjs";
import { PluralPipe } from "../../../shared/pipes/plural.pipe";
import { getMuscleGroupColor, getMuscleGroupLabel } from "../../../shared/utils/muscle-group-color";
import { I18N } from "../../../shared/i18n/i18n";

interface ExerciseGroup {
    readonly label: string;
    readonly color: string;
    readonly exercises: readonly Exercise[];
}

@Component({
    selector: 'app-list-exercises',
    imports: [FirstLetterUppercasePipe, RouterLink, RouterOutlet, ReactiveFormsModule, PluralPipe],
    templateUrl: './list-exercises.component.html',
    styleUrl: './list-exercises.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class ListExercisesComponent {

    // The exercise detail is a nested route rendered as a sliding overlay (see
    // app.routes.ts): these mirror the child <router-outlet>'s activation state so the
    // overlay's visibility/animation and the body scroll lock stay in sync with it.
    protected readonly detailOpen = signal(false);

    protected readonly exercises = signal<Exercise[]>([]);
    protected readonly filterExercises = signal<Exercise[]>([]);
    protected readonly muscleGroupEnum = Object.entries(MuscleGroupEnum)
        .filter(([key]) => isNaN(Number(key)))
        .sort()
        .map(([label, value]) => ({
            label,
            id: value as MuscleGroupEnum
        }));
    protected readonly selectedMuscleGroup = signal<number | null>(null);
    protected readonly loading = signal(true);
    protected readonly i18n = I18N.library.listExercises;

    protected readonly searchExercise = new FormControl();

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

        // Deferred to the first change detection flush (like the lifecycle hook it
        // replaces) rather than fired here, so tests that never call
        // fixture.detectChanges() don't leave an unflushed HTTP request behind.
        effect(() => {
            this.exerciseService.findAll()
                .subscribe({
                    next: (exercises) => {
                        this.exercises.set(exercises);
                        this.filterExercises.set(exercises);
                        this.loading.set(false);
                        this.applyMuscleGroupFromQueryParams();
                    },
                    error: (err) => {
                        this.loading.set(false);
                        this.alertService.show({
                            severity: 'error',
                            message: err?.error?.message ?? this.i18n.loadError
                        });
                    }
                });

            this.searchExercise.valueChanges
                .pipe(
                    debounceTime(300),
                    switchMap((value: string) => {
                        if (!value || value.length === 0) {
                            return of(this.exercises());
                        }

                        if (value.length < 3) {
                            return of(this.filterExercises());
                        }

                        return this.exerciseService.search(value);
                    })
                )
                .subscribe((exercises) => {
                    this.filterExercises.set(exercises);
                    this.selectedMuscleGroup.set(null);
                });
        });
    }

    protected filterExercise(muscleGroupEnum: number) {
        if (this.selectedMuscleGroup() === muscleGroupEnum) {
            this.filterExercises.set(this.exercises());
            this.selectedMuscleGroup.set(null);
            return;
        }
        this.selectedMuscleGroup.set(muscleGroupEnum);
        this.exerciseService.findExercisesByMuscleGroup(muscleGroupEnum)
            .subscribe({
                next: (exercises) => this.filterExercises.set(exercises),
                error: (err) => {
                    this.alertService.show({
                        severity: 'error',
                        message: err?.error?.message ?? this.i18n.loadError
                    });
                }
            });
    }

    // Groups exercises by muscle group for the default browsing view (carousels per
    // group). Only used when neither a search nor a muscle group filter is active.
    protected get isBrowsing(): boolean {
        return this.selectedMuscleGroup() === null && !this.searchExercise.value;
    }

    protected get groupedExercises(): ExerciseGroup[] {
        const exercisesByGroupName = new Map<string, Exercise[]>();

        for (const exercise of this.filterExercises()) {
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

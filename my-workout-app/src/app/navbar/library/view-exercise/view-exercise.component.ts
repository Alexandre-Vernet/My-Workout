import { ChangeDetectionStrategy, Component, computed, effect, input, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ExerciseService } from '../../../services/exercise.service';
import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../auth/auth.service';
import { ExerciseMuscle } from '../../../../interfaces/ExerciseMuscle';
import { CustomError } from '../../../../interfaces/CustomError';
import { DifficultyEnum } from '../../../../interfaces/DifficultyEnum';
import { DifficultyLabelPipe } from "../../../shared/pipes/difficulty-label.pipe";
import { MechanicLabelPipe } from "../../../shared/pipes/mechanic-label.pipe";
import { getErrorMessage } from "../../../shared/utils/http-error";
import { getMuscleGroupColor } from "../../../shared/utils/muscle-group-color";
import { I18N } from "../../../shared/i18n/i18n";

type DetailTab = 'info' | 'execution';

const DIFFICULTY_COLOR: Record<DifficultyEnum, string> = {
    [DifficultyEnum.BEGINNER]: 'var(--p-green-500)',
    [DifficultyEnum.INTERMEDIATE]: 'var(--p-orange-500)',
    [DifficultyEnum.ADVANCED]: 'var(--p-red-500)'
};

@Component({
    selector: 'app-view-exercise',
    imports: [DifficultyLabelPipe, MechanicLabelPipe],
    templateUrl: './view-exercise.component.html',
    styleUrl: './view-exercise.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class ViewExerciseComponent {
    private readonly exerciseService = inject(ExerciseService);
    private readonly alertService = inject(AlertService);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);


    exerciseId = input.required<number>();
    returnTo = input<string>();
    protected readonly exerciseMuscle = signal<ExerciseMuscle | undefined>(undefined);
    protected readonly user = toSignal(this.authService.getCurrentUser());
    protected readonly imagePath = computed(() => {
        const exerciseMuscle = this.exerciseMuscle();
        return exerciseMuscle ? `/assets/images/${ exerciseMuscle.exercise?.id }.gif` : '';
    });

    protected readonly activeTab = signal<DetailTab>('info');
    protected readonly i18n = I18N.library.viewExercise;

    constructor() {
        effect(() => {
            this.exerciseService.findExerciseMuscle(this.exerciseId())
                .subscribe({
                    next: (exerciseMuscle) => this.exerciseMuscle.set(exerciseMuscle),
                    error: () => this.router.navigate(['not-found'])
                });
        });
    }

    protected get heroColor(): string {
        return getMuscleGroupColor(this.exerciseMuscle()!.muscles?.[0]?.muscleGroup?.name);
    }

    protected difficultyColor(difficulty: string | undefined): string {
        return DIFFICULTY_COLOR[difficulty as DifficultyEnum] ?? 'var(--p-text-muted-color)';
    }

    protected setActiveTab(tab: DetailTab) {
        this.activeTab.set(tab);
    }

    // Closes the detail overlay by navigating back up to the library list route
    // (this component is nested under it — see app.routes.ts), unless it was opened
    // from an in-progress workout session (returnTo query param), in which case it
    // navigates back there instead.
    protected goBack() {
        const returnTo = this.returnTo();
        if (returnTo) {
            this.router.navigateByUrl(returnTo);
        } else {
            this.router.navigate(['..'], { relativeTo: this.route });
        }
    }

    protected toggleExerciseWorkout() {
        this.exerciseService.toggleExerciseWorkout(this.exerciseMuscle()!.exercise!)
            .subscribe({
                next: () => this.exerciseMuscle.update(exerciseMuscle => ({
                    ...exerciseMuscle!,
                    addedToWorkout: !exerciseMuscle!.addedToWorkout
                })),
                error: (err: CustomError) => {
                    this.alertService.show({
                        severity: 'error',
                        message: getErrorMessage(err, this.i18n.toggleWorkoutError)
                    });
                }
            });
    }

    protected updateExercise() {
        this.router.navigate(['admin', 'update-exercise', this.exerciseMuscle()!.exercise?.id]);
    }
}

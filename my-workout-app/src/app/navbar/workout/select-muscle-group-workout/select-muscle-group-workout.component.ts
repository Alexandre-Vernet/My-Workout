import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { MuscleGroupService } from '../../../services/muscle-group.service';
import { Router } from '@angular/router';
import { MenuUrls } from '../../../shared/menu-urls';
import {
    DialogSelectCardioExerciseComponent
} from '../dialog-select-cardio-exercise/dialog-select-cardio-exercise.component';
import { Alert } from '../../../../interfaces/alert';
import { AlertService } from '../../../services/alert.service';
import { MuscleGroupExerciseCount } from '../../../../interfaces/MuscleGroupExerciseCount';
import { FirstLetterUppercasePipe } from '../../../shared/pipes/first-letter-uppercase.pipe';
import { MuscleGroupEnum } from '../../../../interfaces/MuscleGroupEnum';
import { MuscleGroup } from '../../../../interfaces/MuscleGroup';
import { ExerciseService } from "../../../services/exercise.service";
import { Exercise } from "../../../../interfaces/Exercise";
import { forkJoin } from "rxjs";
import { NO_EXERCISES_DIALOG } from "../../../shared/utils/confirm-no-exercises-dialog";
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { getMuscleGroupColor } from '../../../shared/utils/muscle-group-color';
import { I18N } from '../../../shared/i18n/i18n';

@Component({
    selector: 'app-select-muscle-group-workout',
    imports: [DialogSelectCardioExerciseComponent, FirstLetterUppercasePipe, ConfirmDialogComponent],
    templateUrl: './select-muscle-group-workout.component.html',
    styleUrl: './select-muscle-group-workout.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class SelectMuscleGroupWorkoutComponent {

    protected readonly i18n = I18N.workout.selectMuscleGroup;

    protected readonly muscleGroupExerciseCount = signal<MuscleGroupExerciseCount[] | null>(null);
    protected readonly cardioExercises = signal<Exercise[]>([]);

    protected readonly isOpenModalExerciseCardio = signal(false);

    protected readonly NO_EXERCISES_DIALOG = NO_EXERCISES_DIALOG;
    protected readonly confirmNoExercisesOpen = signal(false);
    protected readonly getMuscleGroupColor = getMuscleGroupColor;

    private pendingMuscleGroup: MuscleGroup | null = null;

    private readonly muscleGroupService = inject(MuscleGroupService);
    private readonly exerciseService = inject(ExerciseService);
    private readonly alertService = inject(AlertService);
    private readonly router = inject(Router);

    constructor() {
        // Deferred to the first change detection flush (like the lifecycle hook it
        // replaces) rather than fired here, so tests that never call
        // fixture.detectChanges() don't leave an unflushed HTTP request behind.
        effect(() => {
            forkJoin([
                this.muscleGroupService.findAllRecommendedMuscleGroup(),
                this.exerciseService.findCardioExercises()
            ])
                .subscribe(([muscleGroupExerciseCount, cardioExercises]) => {
                    this.muscleGroupExerciseCount.set(muscleGroupExerciseCount);
                    this.cardioExercises.set(cardioExercises);
                });
        });
    }

    protected openModalCardioExerciseChange() {
        this.isOpenModalExerciseCardio.set(false);
        this.muscleGroupService.findAllRecommendedMuscleGroup()
            .subscribe(muscleGroupExerciseCount => this.muscleGroupExerciseCount.set(muscleGroupExerciseCount));
    }

    protected clickMuscleGroup(muscleGroup: MuscleGroup) {
        if (muscleGroup.id === MuscleGroupEnum.CARDIO) {
            this.openModalExerciseCardio(muscleGroup);
        } else {
            this.router.navigate(['/', MenuUrls.workout, 'workout-session', muscleGroup.id]);
        }
    }

    protected showAlert(alert: Alert) {
        window.scrollTo(0, 0);
        this.alertService.show(alert);
    }

    protected confirmAddExercises() {
        this.confirmNoExercisesOpen.set(false);
        if (this.pendingMuscleGroup) {
            this.router.navigate(['/', 'library'], { queryParams: { muscleGroup: this.pendingMuscleGroup.id } });
        }
    }

    protected cancelAddExercises() {
        this.confirmNoExercisesOpen.set(false);
        this.router.navigate(['/', 'workout']);
    }

    private openModalExerciseCardio(muscleGroup: MuscleGroup) {
        // If user has no exercise cardio, show dialog to add these exercises
        const cardioExercise = this.muscleGroupExerciseCount()?.some(m => m.muscleGroup.id === MuscleGroupEnum.CARDIO);
        if (!cardioExercise) {
            this.pendingMuscleGroup = muscleGroup;
            this.confirmNoExercisesOpen.set(true);
            return;
        }

        this.isOpenModalExerciseCardio.set(true);
    }
}

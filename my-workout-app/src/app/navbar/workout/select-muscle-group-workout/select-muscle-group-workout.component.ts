import { Component, inject, OnInit, signal } from '@angular/core';
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

@Component({
    selector: 'app-select-muscle-group-workout',
    imports: [DialogSelectCardioExerciseComponent, FirstLetterUppercasePipe, ConfirmDialogComponent],
    templateUrl: './select-muscle-group-workout.component.html',
    styleUrl: './select-muscle-group-workout.component.scss',
    standalone: true
})
export class SelectMuscleGroupWorkoutComponent implements OnInit {

    muscleGroupExerciseCount: MuscleGroupExerciseCount[] | null = null;
    cardioExercises: Exercise[] = [];

    isOpenModalExerciseCardio = false;

    protected readonly NO_EXERCISES_DIALOG = NO_EXERCISES_DIALOG;
    protected readonly confirmNoExercisesOpen = signal(false);
    protected readonly getMuscleGroupColor = getMuscleGroupColor;

    private pendingMuscleGroup: MuscleGroup | null = null;

    private readonly muscleGroupService = inject(MuscleGroupService);
    private readonly exerciseService = inject(ExerciseService);
    private readonly alertService = inject(AlertService);
    private readonly router = inject(Router);

    ngOnInit() {
        forkJoin([
            this.muscleGroupService.findAllRecommendedMuscleGroup(),
            this.exerciseService.findCardioExercises()
        ])
            .subscribe(([muscleGroupExerciseCount, cardioExercises]) => {
                this.muscleGroupExerciseCount = muscleGroupExerciseCount;
                this.cardioExercises = cardioExercises;
            });
    }

    openModalCardioExerciseChange() {
        this.isOpenModalExerciseCardio = false;
        this.muscleGroupService.findAllRecommendedMuscleGroup()
            .subscribe(muscleGroupExerciseCount => this.muscleGroupExerciseCount = muscleGroupExerciseCount);
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
        const cardioExercise = this.muscleGroupExerciseCount?.some(m => m.muscleGroup.id === MuscleGroupEnum.CARDIO);
        if (!cardioExercise) {
            this.pendingMuscleGroup = muscleGroup;
            this.confirmNoExercisesOpen.set(true);
            return;
        }

        this.isOpenModalExerciseCardio = true;
    }
}

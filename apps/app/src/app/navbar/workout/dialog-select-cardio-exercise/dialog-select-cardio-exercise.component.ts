import { Component, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { Subject, switchMap, take } from 'rxjs';
import { ExerciseService } from '../../../services/exercise.service';
import { Exercise } from '../../../../../../../libs/interfaces/exercise';
import { MuscleGroup } from '../../../../../../../libs/interfaces/MuscleGroup';
import { Workout } from '../../../../../../../libs/interfaces/workout';
import { WorkoutService } from '../../../services/workout.service';
import { HistoryService } from '../../../services/history.service';
import { History } from '../../../../../../../libs/interfaces/history';
import { Alert } from '../../../../../../../libs/interfaces/alert';
import { ThemeService } from '../../../theme/theme.service';
import { ErrorCode } from '../../../../../../../libs/error-code/error-code';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
    selector: 'app-dialog-select-cardio-exercise',
    imports: [CommonModule, Dialog, ConfirmDialog],
    templateUrl: './dialog-select-cardio-exercise.component.html',
    styleUrl: './dialog-select-cardio-exercise.component.scss',
    standalone: true,
    providers: [ConfirmationService]
})
export class DialogSelectCardioExerciseComponent implements OnInit {

    @Input() openModal: boolean;
    @Output() closeModal = new Subject<void>();
    @Output() showAlert = new Subject<Alert>();

    cardioExercises: Exercise[] = [];

    private MUSCLE_GROUP_CARDIO_ID = 8;

    isDarkMode = false;

    hasConfirmedDuplicateWorkout = false;
    private createExercise: Exercise;

    constructor(
        private readonly exerciseService: ExerciseService,
        private readonly workoutService: WorkoutService,
        private readonly historyService: HistoryService,
        private readonly themeService: ThemeService,
        private readonly confirmationService: ConfirmationService
    ) {
    }

    ngOnInit() {
        this.exerciseService
            .findCardioExercises()
            .pipe(take(1))
            .subscribe({
                next: (cardioExercises) => this.cardioExercises = cardioExercises,
                error: (err) => {
                    this.closeModal.next();
                    this.showAlert.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Impossible d\'afficher les exercices'
                    });
                }
            });

        this.isDarkMode = this.themeService.isDarkMode();

    }

    onCloseModal() {
        this.closeModal.next();
    }

    createWorkout(exercise: Exercise, forceCreateWorkout = false) {
        this.createExercise = exercise;
        const muscleGroup: MuscleGroup = {
            id: this.MUSCLE_GROUP_CARDIO_ID
        };

        const workout: Workout = {
            muscleGroup,
            date: new Date()
        };

        this.workoutService.create(workout, forceCreateWorkout)
            .pipe(
                take(1),
                switchMap(workout => {
                    const newExercise: Exercise = {
                        id: exercise.id
                    };

                    const history: History = {
                        workout,
                        exercise: newExercise
                    };

                    return this.historyService.create(history);
                })
            )
            .subscribe({
                next: () => {
                    this.closeModal.next();
                    this.showAlert.next({
                        severity: 'success',
                        message: `L'entraînement ${ exercise.name } a été créé avec succès`
                    });
                },
                error: (err) => {
                    if (err?.error?.errorCode === ErrorCode.duplicateWorkout) {
                        if (!this.hasConfirmedDuplicateWorkout) {
                            this.showDialogConfirmDuplicateWorkout();
                        }
                        this.hasConfirmedDuplicateWorkout = true;
                        return;
                    }

                    this.closeModal.next();

                    this.showAlert.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Impossible de créer l\'entraînement'
                    });
                }
            });
    }

    private showDialogConfirmDuplicateWorkout() {
        this.confirmationService.confirm({
            header: 'Attention',
            message: 'Vous avez déjà réalisé une séance cardio aujourd’hui.<br/>Souhaitez-vous en faire une autre ?',
            closable: true,
            closeOnEscape: true,
            dismissableMask: true,
            icon: 'pi pi-exclamation-triangle',
            acceptButtonProps: {
                label: 'Confirmer'
            },
            rejectButtonProps: {
                label: 'Annuler',
                severity: 'secondary',
                outlined: true
            },
            accept: () => {
                this.createWorkout(this.createExercise, true);
                this.hasConfirmedDuplicateWorkout = false;
            },
            reject: () => {
                this.closeModal.next();
                this.hasConfirmedDuplicateWorkout = false;
            }
        });
    }
}

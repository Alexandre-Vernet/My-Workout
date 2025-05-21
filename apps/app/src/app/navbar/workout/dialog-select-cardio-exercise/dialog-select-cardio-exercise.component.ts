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
    @Input() muscleGroupIdCardio: number;
    @Output() closeModal = new Subject<void>();
    @Output() showAlert = new Subject<Alert>();

    cardioExercises: Exercise[] = [];

    isDarkMode = false;


    constructor(
        private readonly exerciseService: ExerciseService,
        private readonly workoutService: WorkoutService,
        private readonly historyService: HistoryService,
        private readonly themeService: ThemeService
    ) {
    }

    ngOnInit() {
        this.findCardioExercises();
        this.isDarkMode = this.themeService.isDarkMode();
    }

    onCloseModal() {
        this.closeModal.next();
    }

    createWorkout(exercise: Exercise) {
        const muscleGroup: MuscleGroup = {
            id: this.muscleGroupIdCardio
        };

        const workout: Workout = {
            muscleGroup,
            date: new Date()
        };

        this.workoutService.create(workout)
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
                    this.closeModal.next();

                    this.showAlert.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Impossible de créer l\'entraînement'
                    });
                }
            });
    }


    private findCardioExercises() {
        this.exerciseService.findCardioExercises()
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
    }
}

import { Component, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { map, Subject, switchMap } from 'rxjs';
import { WorkoutService } from '../../../services/workout.service';
import { HistoryService } from '../../../services/history.service';
import { ThemeService } from '../../../theme/theme.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputNumber } from 'primeng/inputnumber';
import { Button } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { Workout } from '../../../interfaces/workout';
import { Exercise } from '../../../interfaces/exercise';
import { Alert } from '../../../interfaces/alert';
import { MuscleGroup } from '../../../interfaces/MuscleGroup';
import { History } from '../../../interfaces/history';

@Component({
    selector: 'app-dialog-select-cardio-exercise',
    imports: [CommonModule, Dialog, ConfirmDialog, InputNumber, Button, FormsModule, FloatLabel],
    templateUrl: './dialog-select-cardio-exercise.component.html',
    styleUrl: './dialog-select-cardio-exercise.component.scss',
    standalone: true,
    providers: [ConfirmationService]
})
export class DialogSelectCardioExerciseComponent implements OnInit {

    @Input() openModal: boolean;
    @Output() openModalChange = new Subject<void>();
    @Input() workoutDate: Date;
    @Output() createdWorkout = new Subject<Workout>();
    @Output() showAlert = new Subject<Alert>();
    @Input() cardioExercises: Exercise[];

    selectedExercise: Exercise;
    inputDuration: number;

    isDarkMode = false;


    constructor(
        private readonly workoutService: WorkoutService,
        private readonly historyService: HistoryService,
        private readonly themeService: ThemeService
    ) {
    }

    ngOnInit() {
        this.isDarkMode = this.themeService.isDarkMode();
    }

    onHideModal() {
        this.resetDuration();
        this.openModalChange.next();
    }

    showInputDuration(exercise: Exercise) {
        this.selectedExercise = exercise;
    }

    createCardioWorkout() {
        const muscleGroup: MuscleGroup = {
            id: 8
        };

        const workout: Workout = {
            muscleGroup,
            date: this.workoutDate ?? new Date(),
            duration: Number(this.inputDuration)
        };

        this.workoutService.create(workout)
            .pipe(
                switchMap(createdWorkout => {
                    const exercise: Exercise = {
                        id: this.selectedExercise.id
                    };

                    const history: History = {
                        workout: createdWorkout,
                        exercise: exercise
                    };

                    return this.historyService.create(history)
                        .pipe(map(() => createdWorkout));
                })
            )
            .subscribe({
                next: (workout) => {
                    const h: History = {
                        exercise: this.selectedExercise
                    };
                    workout.history = [];
                    workout.history.push(h);
                    this.createdWorkout.next(workout);

                    this.showAlert.next({
                        severity: 'success',
                        message: `L'entraînement ${ this.selectedExercise.name } a été créé avec succès`
                    });
                },
                error: (err) => {
                    this.showAlert.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Impossible de créer l\'entraînement'
                    });
                },
                complete: () => {
                    this.resetDuration();
                    this.openModalChange.next();
                }
            });

    }

    private resetDuration() {
        this.selectedExercise = null;
        this.inputDuration = null;
    }
}

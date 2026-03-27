import { Component, Input, OnInit, Output } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { Subject } from 'rxjs';
import { Exercise } from '../../../../interfaces/exercise';
import { MuscleGroup } from '../../../../interfaces/MuscleGroup';
import { Workout } from '../../../../interfaces/workout';
import { WorkoutService } from '../../../services/workout.service';
import { History } from '../../../../interfaces/history';
import { Alert } from '../../../../interfaces/alert';
import { ThemeService } from '../../../shared/theme/theme.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputNumber } from 'primeng/inputnumber';
import { Button } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { NgClass } from '@angular/common';
import { MuscleGroupEnum } from '../../../../interfaces/MuscleGroupEnum';

@Component({
    selector: 'app-dialog-select-cardio-exercise',
    imports: [Dialog, ConfirmDialog, InputNumber, Button, FormsModule, FloatLabel, NgClass],
    templateUrl: './dialog-select-cardio-exercise.component.html',
    styleUrl: './dialog-select-cardio-exercise.component.scss',
    standalone: true,
    providers: [ConfirmationService]
})
export class DialogSelectCardioExerciseComponent implements OnInit {

    @Input() openModal: boolean;
    @Output() openModalChange = new Subject<void>();
    @Input() workoutDate: Date;
    @Input() cardioExercises: Exercise[] = [];
    @Output() createdWorkout = new Subject<Workout>();
    @Output() showAlert = new Subject<Alert>();

    selectedExercise: Exercise;
    inputDuration: number;

    isDarkMode = false;


    constructor(
        private readonly workoutService: WorkoutService,
        private readonly themeService: ThemeService,
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
            id: MuscleGroupEnum.CARDIO
        };

        const workout: Workout = {
            muscleGroup,
            date: this.workoutDate ?? new Date(),
            duration: Number(this.inputDuration)
        };

        const history: History = {
            exercise: {
                id: this.selectedExercise.id
            }
        };

        this.workoutService.create(workout, history)
            .subscribe({
                next: (workout) => {
                    const h: History = {
                        exercise: this.selectedExercise
                    };
                    workout.histories.push(h);
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

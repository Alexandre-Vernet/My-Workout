import { Component, inject, input, model, output } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { Exercise } from '../../../../interfaces/Exercise';
import { MuscleGroup } from '../../../../interfaces/MuscleGroup';
import { Workout } from '../../../../interfaces/Workout';
import { WorkoutService } from '../../../services/workout.service';
import { History } from '../../../../interfaces/History';
import { Alert } from '../../../../interfaces/alert';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputNumber } from 'primeng/inputnumber';
import { Button } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { MuscleGroupEnum } from '../../../../interfaces/MuscleGroupEnum';

@Component({
    selector: 'app-dialog-select-cardio-exercise',
    imports: [Dialog, ConfirmDialog, InputNumber, Button, FormsModule, FloatLabel],
    templateUrl: './dialog-select-cardio-exercise.component.html',
    styleUrl: './dialog-select-cardio-exercise.component.scss',
    standalone: true,
    providers: [ConfirmationService]
})
export class DialogSelectCardioExerciseComponent {

    openModal = model(false);
    workoutDate = input<Date>();
    cardioExercises = input<Exercise[]>([]);
    createdWorkout = output<Workout>();
    showAlert = output<Alert>();

    selectedExercise: Exercise | null = null;
    inputDuration: number | null = null;

    private readonly workoutService = inject(WorkoutService);


    onHideModal() {
        this.resetDuration();
        this.openModal.set(false);
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
            date: this.workoutDate() ?? new Date(),
        };

        const history: History = {
            duration: Number(this.inputDuration),
            exercise: {
                id: this.selectedExercise?.id
            }
        };

        this.workoutService.create(workout, history)
            .subscribe({
                next: (workout) => {
                    const h: History = {
                        exercise: this.selectedExercise ?? undefined
                    };
                    workout.histories = workout.histories ?? [];
                    workout.histories.push(h);
                    this.createdWorkout.emit(workout);

                    this.showAlert.emit({
                        severity: 'success',
                        message: `L'entraînement ${ this.selectedExercise?.name } a été créé avec succès`
                    });
                },
                error: (err) => {
                    this.showAlert.emit({
                        severity: 'error',
                        message: err?.error?.message ?? 'Impossible de créer l\'entraînement'
                    });
                },
                complete: () => {
                    this.resetDuration();
                    this.openModal.set(false);
                }
            });

    }

    private resetDuration() {
        this.selectedExercise = null;
        this.inputDuration = null;
    }
}

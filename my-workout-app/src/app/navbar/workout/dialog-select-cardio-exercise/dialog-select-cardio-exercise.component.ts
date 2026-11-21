import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input, model, output, signal } from '@angular/core';
import { Exercise } from '../../../../interfaces/Exercise';
import { MuscleGroup } from '../../../../interfaces/MuscleGroup';
import { Workout } from '../../../../interfaces/Workout';
import { WorkoutService } from '../../../services/workout.service';
import { History } from '../../../../interfaces/History';
import { Alert } from '../../../../interfaces/alert';
import { MuscleGroupEnum } from '../../../../interfaces/MuscleGroupEnum';
import { CustomError } from '../../../../interfaces/CustomError';
import { getErrorMessage } from '../../../shared/utils/http-error';
import { NumberStepperComponent } from '../../../shared/number-stepper/number-stepper.component';
import { I18N } from '../../../shared/i18n/i18n';

@Component({
    selector: 'app-dialog-select-cardio-exercise',
    imports: [NumberStepperComponent],
    templateUrl: './dialog-select-cardio-exercise.component.html',
    styleUrl: './dialog-select-cardio-exercise.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class DialogSelectCardioExerciseComponent {

    protected readonly i18n = I18N.workout.dialogSelectCardioExercise;

    openModal = model(false);
    workoutDate = input<Date>();
    cardioExercises = input<Exercise[]>([]);
    createdWorkout = output<Workout>();
    showAlert = output<Alert>();

    protected readonly selectedExercise = signal<Exercise | null>(null);
    protected inputDuration: number | null = null;

    private readonly workoutService = inject(WorkoutService);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);


    protected onHideModal() {
        this.resetDuration();
        this.openModal.set(false);
    }

    protected showInputDuration(exercise: Exercise) {
        this.selectedExercise.set(exercise);
    }

    protected createCardioWorkout() {
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
                id: this.selectedExercise()?.id
            }
        };

        this.workoutService.create(workout, history)
            .subscribe({
                next: (workout) => {
                    const h: History = {
                        exercise: this.selectedExercise() ?? undefined
                    };
                    workout.histories = workout.histories ?? [];
                    workout.histories.push(h);
                    this.createdWorkout.emit(workout);

                    this.showAlert.emit({
                        severity: 'success',
                        message: this.i18n.createdSuccessMessage(this.selectedExercise()?.name)
                    });
                },
                error: (err: CustomError) => {
                    this.showAlert.emit({
                        severity: 'error',
                        message: getErrorMessage(err, this.i18n.createErrorMessage)
                    });
                },
                complete: () => {
                    this.resetDuration();
                    this.openModal.set(false);
                }
            });

    }

    private resetDuration() {
        this.selectedExercise.set(null);
        this.inputDuration = null;
        this.changeDetectorRef.markForCheck();
    }
}

import { Component, input, OnInit, inject, signal } from '@angular/core';
import { ExerciseService } from '../../../../services/exercise.service';
import { Exercise } from '../../../../../interfaces/Exercise';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MuscleService } from '../../../../services/muscle.service';
import { Muscle } from '../../../../../interfaces/Muscle';
import { AlertService } from '../../../../services/alert.service';
import { Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { ExerciseMuscle } from '../../../../../interfaces/ExerciseMuscle';
import { CustomError } from "../../../../../interfaces/CustomError";
import { MuscleDropdown } from "../../../../../interfaces/MuscleDropdown";
import { MechanicEnum } from "../../../../../interfaces/MechanicEnum";
import { DifficultyEnum } from "../../../../../interfaces/DifficultyEnum";
import { DifficultyLabelPipe } from "../../../../shared/pipes/difficulty-label.pipe";
import { MechanicLabelPipe } from "../../../../shared/pipes/mechanic-label.pipe";
import { getErrorCode, getErrorMessage } from "../../../../shared/utils/http-error";
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { getMuscleGroupColor } from '../../../../shared/utils/muscle-group-color';

@Component({
    selector: 'app-add-exercise',
    templateUrl: './add-exercise.component.html',
    styleUrl: './add-exercise.component.scss',
    imports: [
        ReactiveFormsModule,
        DifficultyLabelPipe,
        MechanicLabelPipe,
        ConfirmDialogComponent,
    ]
})
export class AddExerciseComponent implements OnInit {
    private readonly exerciseService = inject(ExerciseService);
    private readonly muscleService = inject(MuscleService);
    private readonly alertService = inject(AlertService);
    private readonly router = inject(Router);


    exerciseId = input<number>();

    protected readonly MechanicEnum = MechanicEnum;
    protected readonly DifficultyEnum = DifficultyEnum;
    protected readonly getMuscleGroupColor = getMuscleGroupColor;

    formAddExercise = new FormGroup({
        id: new FormControl<number | null>(null),
        name: new FormControl<string | null>(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
        description: new FormControl<string | null>(null, [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]),
        muscles: new FormControl<Muscle[] | null>(null, Validators.required),
        difficulty: new FormControl<DifficultyEnum>(DifficultyEnum.BEGINNER, Validators.required),
        mechanic: new FormControl<MechanicEnum>(MechanicEnum.COMPOUND, Validators.required),
    });

    loadingDescription = false;

    musclesDropdown: MuscleDropdown[] = [];
    musclesPanelOpen = signal(false);
    addToWorkoutConfirm = signal<Exercise | null>(null);

    ngOnInit() {
        this.muscleService.findAllMuscles()
            .pipe(
                tap(musclesDropdown => this.musclesDropdown = musclesDropdown),
                filter(() => !!this.exerciseId()),
                switchMap(() => this.exerciseService.findExerciseMuscle(this.exerciseId()!))
            )
            .subscribe({
                next: (exerciseMuscle) => {
                    const exercise = exerciseMuscle.exercise;
                    if (!exercise) {
                        return;
                    }

                    const allMuscles = this.musclesDropdown.flatMap(group => group.items);

                    const selectedMuscles = allMuscles.filter(dropdownMuscle =>
                        exerciseMuscle.muscles?.some(muscle => muscle.id === dropdownMuscle.id)
                    );

                    this.formAddExercise.patchValue({
                        id: exercise.id,
                        name: exercise.name,
                        description: exercise.description,
                        muscles: selectedMuscles,
                        difficulty: exercise.difficulty as DifficultyEnum,
                        mechanic: exercise.mechanic as MechanicEnum
                    });
                },
                error: () => this.router.navigate(['not-found'])
            });
    }

    generateExerciseDescription() {
        this.loadingDescription = true;
        const exerciseName = this.formAddExercise.controls.name.value ?? '';
        this.exerciseService.generateExerciseDescription(exerciseName)
            .subscribe({
                next: ({ description }) => {
                    this.loadingDescription = false;
                    this.formAddExercise.controls.description.setValue(description);
                },
                error: (err: CustomError) => {
                    this.loadingDescription = false;
                    const errorCode = getErrorCode(err);
                    if (errorCode === 'QUOTA_EXCEEDED') {
                        this.formAddExercise.controls.description.setErrors({
                            quotaExceeded: true
                        });
                    } else if (errorCode === 'EXERCISE_NOT_FOUND') {
                        this.formAddExercise.controls.description.setErrors({
                            exerciseNotFound: true
                        });
                    } else {
                        this.formAddExercise.controls.description.setErrors({
                            unknownError: true
                        });
                    }
                }
            })
    }

    isMuscleSelected(muscle: Muscle): boolean {
        return !!this.formAddExercise.controls.muscles.value?.some(selected => selected.id === muscle.id);
    }

    toggleMuscle(muscle: Muscle) {
        const muscles = this.formAddExercise.controls.muscles.value ?? [];
        const updatedMuscles = this.isMuscleSelected(muscle)
            ? muscles.filter(selected => selected.id !== muscle.id)
            : [...muscles, muscle];

        this.formAddExercise.controls.muscles.setValue(updatedMuscles);
        this.formAddExercise.controls.muscles.markAsTouched();
    }

    createExercise() {
        const { id, name, description, muscles, difficulty, mechanic } = this.formAddExercise.getRawValue();
        const exercise: Exercise = {
            id: id ?? undefined,
            name: (name ?? '').trim(),
            description: (description ?? '').trim(),
            difficulty: difficulty ?? undefined,
            mechanic: mechanic ?? undefined
        };

        const exerciseMuscle: ExerciseMuscle = {
            exercise,
            muscles: muscles ?? []
        }

        this.exerciseService.createOrUpdateExercise(exerciseMuscle)
            .subscribe({
                next: (exerciseCreated) => {
                    this.alertService.show({
                        severity: 'success',
                        message: 'L\'exercice a bien été mis à jour'
                    });
                    if (!exercise.id) {
                        this.addToWorkoutConfirm.set(exerciseCreated);
                    }
                },
                error: (err: CustomError) => {
                    const errorCode = getErrorCode(err);
                    if (errorCode === 'EXERCISE_NAME_ALREADY_EXIST') {
                        this.formAddExercise.controls.name.setErrors({
                            exerciseNameAlreadyExist: true
                        })
                    }  else if (errorCode === 'DOUBLE_MUSCLE_GROUP') {
                        this.formAddExercise.controls.muscles.setErrors({
                            duplicatMuscleGroup: true
                        })
                    } else if (err?.error?.errors?.[0]?.field === 'exercise.name') {
                        this.formAddExercise.controls.name.setErrors({
                            exerciseNameError: true
                        })
                    } else {
                        this.formAddExercise.controls.name.setErrors({
                            unknownError: true
                        })
                    }
                }
            });
    }

    confirmAddToWorkout() {
        const exercise = this.addToWorkoutConfirm();
        if (!exercise) {
            return;
        }

        this.addToWorkoutConfirm.set(null);
        this.addExerciseToWorkout(exercise);
    }

    cancelAddToWorkout() {
        this.addToWorkoutConfirm.set(null);
    }

    private addExerciseToWorkout(exercise: Exercise) {
        this.exerciseService.toggleExerciseWorkout(exercise)
            .subscribe({
                next: () => {
                    this.alertService.show({
                        severity: 'success',
                        message: 'Exercice ajouté à vos entraînements'
                    });
                },
                error: (err: CustomError) => {
                    this.alertService.show({
                        severity: 'error',
                        message: getErrorMessage(err, 'Impossible d\'enregistrer cet exercice')
                    });
                }
            });
    }
}

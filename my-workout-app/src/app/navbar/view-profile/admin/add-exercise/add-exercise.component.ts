import { Component, input, OnInit, inject } from '@angular/core';
import { ExerciseService } from '../../../../services/exercise.service';
import { Exercise } from '../../../../../interfaces/Exercise';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Textarea } from 'primeng/textarea';
import { MuscleService } from '../../../../services/muscle.service';
import { MultiSelect } from 'primeng/multiselect';
import { Muscle } from '../../../../../interfaces/Muscle';
import { AlertService } from '../../../../services/alert.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { Message } from 'primeng/message';
import { ExerciseMuscle } from '../../../../../interfaces/ExerciseMuscle';
import { CustomError } from "../../../../../interfaces/CustomError";
import { MuscleDropdown } from "../../../../../interfaces/MuscleDropdown";
import { MechanicEnum } from "../../../../../interfaces/MechanicEnum";
import { DifficultyEnum } from "../../../../../interfaces/DifficultyEnum";
import { RadioButton } from "primeng/radiobutton";
import { DifficultyLabelPipe } from "../../../../shared/pipes/difficulty-label.pipe";
import { MechanicLabelPipe } from "../../../../shared/pipes/mechanic-label.pipe";
import { getErrorCode } from "../../../../shared/utils/http-error";

@Component({
    selector: 'app-add-exercise',
    templateUrl: './add-exercise.component.html',
    styleUrls: ['./add-exercise.component.scss'],
    imports: [
        Button,
        FloatLabel,
        InputText,
        ReactiveFormsModule,
        Textarea,
        MultiSelect,
        ConfirmDialog,
        Message,
        RadioButton,
        DifficultyLabelPipe,
        MechanicLabelPipe,
    ],
    providers: [ConfirmationService, MessageService]
})
export class AddExerciseComponent implements OnInit {
    private readonly exerciseService = inject(ExerciseService);
    private readonly muscleService = inject(MuscleService);
    private readonly alertService = inject(AlertService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly messageService = inject(MessageService);
    private readonly router = inject(Router);


    exerciseId = input<number>();

    protected readonly MechanicEnum = MechanicEnum;
    protected readonly DifficultyEnum = DifficultyEnum;

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

    createExercise(event: Event) {
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
                        this.showDialogAddExerciseToWorkout(exerciseCreated, event);
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


    private showDialogAddExerciseToWorkout(exercise: Exercise, event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Voulez-vous ajouter cet exercice à vos entraînements ?',
            header: 'Confirmation',
            closable: true,
            closeOnEscape: true,
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Non',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Oui',
            },
            accept: () => this.addExerciseToWorkout(exercise),
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected',
                    life: 3000,
                });
            },
        });
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
                error: (err) => {
                    this.alertService.show({
                        severity: 'error',
                        message: err?.error?.message ?? 'Impossible d\'enregistrer cet exercice'
                    });
                }
            });
    }
}

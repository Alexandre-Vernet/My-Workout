import { Component, OnInit } from '@angular/core';
import { ExerciseService } from '../../../../services/exercise.service';
import { Exercise } from '../../../../../interfaces/Exercise';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Textarea } from 'primeng/textarea';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { MuscleService } from '../../../../services/muscle.service';
import { MultiSelect } from 'primeng/multiselect';
import { Muscle } from '../../../../../interfaces/Muscle';
import { AlertService } from '../../../../services/alert.service';
import { UserExerciseService } from '../../../../services/user-exercise.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { Message } from 'primeng/message';
import { ExerciseMuscle } from '../../../../../interfaces/ExerciseMuscle';
import { CustomError } from "../../../../../interfaces/CustomError";
import { MuscleDropdown } from "../../../../../interfaces/MuscleDropdown";

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
        ToggleSwitch,
        MultiSelect,
        ConfirmDialog,
        Message
    ],
    providers: [ConfirmationService, MessageService]
})
export class AddExerciseComponent implements OnInit {

    formAddExercise = new FormGroup({
        id: new FormControl<number>(null),
        name: new FormControl<string>(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
        description: new FormControl<string>(null, [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]),
        isSmartWorkout: new FormControl<boolean>(false, Validators.required),
        muscles: new FormControl<Muscle[]>(null, Validators.required)
    });

    loadingDescription = false;

    musclesDropdown: MuscleDropdown[] = [];

    constructor(
        private readonly exerciseService: ExerciseService,
        private readonly muscleService: MuscleService,
        private readonly alertService: AlertService,
        private readonly userExerciseService: UserExerciseService,
        private readonly confirmationService: ConfirmationService,
        private readonly messageService: MessageService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router
    ) {
    }

    ngOnInit() {
        this.muscleService.findAllMuscles()
            .pipe(
                tap(musclesDropdown => this.musclesDropdown = musclesDropdown),
                switchMap(() =>
                    this.activatedRoute.params.pipe(
                        filter((params: { exerciseId: number }) => !!params.exerciseId),
                        switchMap(params =>
                            this.exerciseService.findExerciseMuscle(Number(params.exerciseId))
                        )
                    )
                )
            )
            .subscribe({
                next: (exerciseMuscle) => {
                    const allMuscles = this.musclesDropdown.flatMap(group => group.items);

                    const selectedMuscles = allMuscles.filter(dropdownMuscle =>
                        exerciseMuscle.muscles.some(muscle => muscle.id === dropdownMuscle.id)
                    );

                    const exercise = exerciseMuscle.exercise;

                    this.formAddExercise.patchValue({
                        id: exercise.id,
                        name: exercise.name,
                        description: exercise.description,
                        isSmartWorkout: exercise.smartWorkout,
                        muscles: selectedMuscles
                    });
                },
                error: () => this.router.navigate(['not-found'])
            });
    }

    generateExerciseDescription() {
        this.loadingDescription = true;
        const exerciseName = this.formAddExercise.controls.name.value;
        this.exerciseService.generateExerciseDescription(exerciseName)
            .subscribe({
                next: ({ description }) => {
                    this.loadingDescription = false;
                    this.formAddExercise.controls.description.setValue(description);
                },
                error: (err: CustomError) => {
                    this.loadingDescription = false;
                    if (err.error.errorCode === 'QUOTA_EXCEEDED') {
                        this.formAddExercise.controls.description.setErrors({
                            quotaExceeded: true
                        });
                    } else if (err.error.errorCode === 'EXERCISE_NOT_FOUND') {
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

    createExercise() {
        const { id, name, description, isSmartWorkout, muscles } = this.formAddExercise.getRawValue();
        const exercise: Exercise = {
            id,
            name: name.trim(),
            description: description.trim(),
            smartWorkout: isSmartWorkout,
        };

        const exerciseMuscle: ExerciseMuscle = {
            exercise,
            muscles
        }

        this.exerciseService.createOrUpdateExercise(exerciseMuscle)
            .subscribe({
                next: (exerciseCreated) => {
                    this.alertService.alert$.next({
                        severity: 'success',
                        message: 'L\'exercice a bien été mis à jour'
                    });
                    if (!exercise.id) {
                        this.showDialogAddExerciseToWorkout(exerciseCreated);
                    }
                },
                error: (err: CustomError) => {
                    if (err?.error?.errorCode === 'EXERCISE_NAME_ALREADY_EXIST') {
                        this.formAddExercise.controls.name.setErrors({
                            exerciseNameAlreadyExist: true
                        })
                    } else if (err?.error?.errors[0].field === 'exercise.name') {
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


    private showDialogAddExerciseToWorkout(exercise: Exercise) {
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
        this.userExerciseService.toggleExerciseWorkout(exercise)
            .subscribe({
                next: () => {
                    this.alertService.alert$.next({
                        severity: 'success',
                        message: 'Exercice ajouté à vos entraînements'
                    });
                },
                error: (err) => {
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Impossible d\'enregistrer cet exercice'
                    });
                }
            });
    }
}

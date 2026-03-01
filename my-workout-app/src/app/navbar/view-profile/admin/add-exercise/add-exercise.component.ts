import { Component, OnInit } from '@angular/core';
import { ExerciseService } from '../../../../services/exercise.service';
import { Exercise } from '../../../../../interfaces/exercise';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Textarea } from 'primeng/textarea';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { MuscleService } from '../../../../services/muscle.service';
import { MuscleDropdown } from '../../../../../interfaces/MuscleDropdown';
import { MultiSelect } from 'primeng/multiselect';
import { Muscle } from '../../../../../interfaces/muscle';
import { AlertService } from '../../../../services/alert.service';
import { UserExerciseService } from '../../../../services/user-exercise.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ActivatedRoute } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { Message } from 'primeng/message';

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
        id: new FormControl(null),
        name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
        description: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(500)]),
        isSmartWorkout: new FormControl(false, Validators.required),
        muscles: new FormControl<Muscle[]>(null, Validators.required)
    });

    muscles: MuscleDropdown[] = [];

    constructor(
        private readonly exerciseService: ExerciseService,
        private readonly muscleService: MuscleService,
        private readonly alertService: AlertService,
        private readonly userExerciseService: UserExerciseService,
        private readonly confirmationService: ConfirmationService,
        private readonly messageService: MessageService,
        private readonly activatedRoute: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.activatedRoute.params
            .pipe(
                filter((params: { exerciseId: number }) => !!params.exerciseId),
                switchMap(params => this.exerciseService.getExercise(Number(params.exerciseId)))
            )
            .subscribe({
                next: (exercise) => {
                    this.formAddExercise.patchValue({
                        id: exercise.id,
                        name: exercise.name,
                        description: exercise.description,
                        isSmartWorkout: exercise.isSmartWorkout,
                        muscles: exercise.muscles
                    });
                }
            });
        this.muscleService.findAllMuscles()
            .subscribe({
                next: (muscles) => this.muscles = muscles,
                error: () => {
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: 'Impossible de récupérer la liste des muscles'
                    });
                }
            });
    }

    createExercise() {
        const { id, name, description, isSmartWorkout, muscles } = this.formAddExercise.getRawValue();
        const exercise: Exercise = {
            name: name.trim(),
            description: description.trim(),
            isSmartWorkout,
            exerciseMuscle: muscles.map(m => ({
                muscle: {
                    id: m.id,
                }
            }))
        };

        if (!id) {
            this.exerciseService.createExercise(exercise)
                .subscribe({
                    next: (exerciseCreated) => {
                        this.alertService.alert$.next({
                            severity: 'success',
                            message: 'L\'exercice a bien été ajouté'
                        });

                        this.formAddExercise.reset();
                        this.showDialogAddExerciseToWorkout(exerciseCreated);
                    },
                    error: (err) => {
                        this.alertService.alert$.next({
                            severity: 'error',
                            message: err?.error?.message ?? 'Une erreur s\'est produite lors de l\'ajout de l\'exercice'
                        });
                    }
                });
        } else {
            exercise.id = id;
            this.exerciseService.updateExercise(exercise)
                .subscribe({
                    next: () => {
                        this.alertService.alert$.next({
                            severity: 'success',
                            message: 'L\'exercice a bien été mis à jour'
                        });
                    },
                    error: (err) => {
                        this.alertService.alert$.next({
                            severity: 'error',
                            message: err?.error?.message ?? 'Une erreur s\'est produite lors de la mise à jour de l\'exercice'
                        });
                    }
                });
        }
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
            accept: () => {
                this.addExerciseToWorkout(exercise);
            },
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

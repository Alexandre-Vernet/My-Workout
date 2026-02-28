import { Component, OnInit } from '@angular/core';
import { ExerciseService } from '../../../../services/exercise.service';
import { Exercise } from '../../../../../interfaces/exercise';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Textarea } from 'primeng/textarea';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { IonContent } from '@ionic/angular/standalone';
import { MuscleService } from '../../../../services/muscle.service';
import { MuscleDropdown } from '../../../../../interfaces/MuscleDropdown';
import { MultiSelect } from 'primeng/multiselect';
import { Muscle } from '../../../../../interfaces/muscle';
import { AlertService } from '../../../../services/alert.service';

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
        IonContent,
        MultiSelect
    ]
})
export class AddExerciseComponent implements OnInit {

    formAddExercise = new FormGroup({
        name: new FormControl('toto', [Validators.required, Validators.maxLength(50)]),
        description: new FormControl('description', [Validators.required, Validators.maxLength(500)]),
        isSmartWorkout: new FormControl(false, Validators.required),
        muscles: new FormControl<Muscle[]>(null, Validators.required)
    });

    muscles: MuscleDropdown[] = [];

    constructor(
        private readonly exerciseService: ExerciseService,
        private readonly muscleService: MuscleService,
        private readonly alertService: AlertService
    ) {
    }

    ngOnInit() {
        this.muscleService.findAllMuscles()
            .subscribe({
                next: (muscles) => {
                    this.muscles = muscles;
                },
                error: () => {
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: 'Impossible de récupérer la liste des muscles'
                    });
                }
            });
    }


    createExercise() {
        const { name, description, isSmartWorkout, muscles } = this.formAddExercise.getRawValue();
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
        this.exerciseService.createExercise(exercise)
            .subscribe({
                next: () => {
                    this.alertService.alert$.next({
                        severity: 'success',
                        message: 'L\'exercice a bien été ajouté'
                    });

                    this.formAddExercise.reset();
                },
                error: () => this.alertService.alert$.next({
                    severity: 'error',
                    message: 'Une erreur s\'est produite lors de l\'ajout de l\'exercice'
                })
            });
    }

}

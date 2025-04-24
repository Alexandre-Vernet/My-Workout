import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, switchMap, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ExerciseService } from '../../../services/exercise.service';
import { Step, StepList, StepPanel, StepPanels, Stepper } from 'primeng/stepper';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Exercise, ExerciseMade } from '../../../../../../../libs/interfaces/exercise';
import { InputNumber } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
    selector: 'app-workout-session',
    imports: [CommonModule, Stepper, StepList, Step, StepPanels, StepPanel, FormsModule, Button, InputNumber, TableModule, ConfirmDialog],
    templateUrl: './workout-session.component.html',
    styleUrl: './workout-session.component.scss',
    standalone: true,
    providers: [ConfirmationService]

})
export class WorkoutSessionComponent implements OnInit {

    exercises: Exercise[] = [];
    exercisesMade: ExerciseMade[] = [];

    activeStep: number = 1;

    weight: number = null;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly exerciseService: ExerciseService,
        private readonly confirmationService: ConfirmationService,
        private readonly router: Router
    ) {
    }

    ngOnInit() {
        this.activatedRoute.params
            .pipe(
                take(1),
                map((params: { muscleGroupId: number }) => params.muscleGroupId),
                switchMap((muscleGroupId) => this.exerciseService.findExercisesByMuscleGroupIdAndUserId(muscleGroupId)
                    .pipe(
                        map(exercises => ({
                            exercises, muscleGroupId
                        }))
                    )
                )
            )
            .subscribe(({ exercises, muscleGroupId }) => {
                this.exercises = exercises;

                if (exercises.length === 0) {
                    this.confirmationService.confirm({
                        target: event.target as EventTarget,
                        header: 'Attention',
                        message: `Vous n'avez ajouté aucun exercice à votre bibliothèque.<br/>Commencez par en ajouter pour pouvoir lancer un entraînement.`,
                        closable: false,
                        closeOnEscape: true,
                        icon: 'pi pi-exclamation-triangle',
                        acceptButtonProps: {
                            label: 'Ajouter'
                        },
                        rejectButtonProps: {
                            label: 'Annuler',
                            severity: 'secondary',
                            outlined: true
                        },
                        accept: () => {
                            this.router.navigate(['/', 'library', 'muscle-group', muscleGroupId]);
                        },
                        reject: () => {
                            this.router.navigate(['/', 'workout']);
                        }
                    });
                }
            });
    }

    saveExercise() {
        const exercise: ExerciseMade = {
            id: this.exercisesMade.length + 1,
            weight: this.weight
        };

        this.exercisesMade.push(exercise);
    }

    clearExercisesMade() {
        this.exercisesMade = [];
    }
}

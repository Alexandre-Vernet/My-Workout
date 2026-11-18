import { Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExerciseService } from '../../../services/exercise.service';
import { AlertService } from '../../../services/alert.service';
import { Button, ButtonDirective } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { Skeleton } from 'primeng/skeleton';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../../../interfaces/User';
import { ExerciseMuscle } from '../../../../interfaces/ExerciseMuscle';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "primeng/tabs";
import { DifficultyLabelPipe } from "../../../shared/pipes/difficulty-label.pipe";
import { MechanicLabelPipe } from "../../../shared/pipes/mechanic-label.pipe";
import { InputNumber } from 'primeng/inputnumber';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Message } from 'primeng/message';

@Component({
    selector: 'app-view-exercise',
    imports: [Button, Tag, Skeleton, Tabs, TabList, Tab, TabPanels, TabPanel, DifficultyLabelPipe, MechanicLabelPipe, InputNumber, FormsModule, ButtonDirective, Message, ReactiveFormsModule],
    templateUrl: './view-exercise.component.html',
    styleUrl: './view-exercise.component.scss',
    standalone: true
})
export class ViewExerciseComponent implements OnInit {

    exerciseId = input.required<number>();
    exerciseMuscle: ExerciseMuscle;
    user: User;
    imagePath = '';

    formPosition = new FormControl<number>(0);

    private readonly exerciseService = inject(ExerciseService);
    private readonly alertService = inject(AlertService);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    ngOnInit() {
        this.authService.getCurrentUser()
            .subscribe(user => this.user = user);

        this.exerciseService.findExerciseMuscle(this.exerciseId())
            .subscribe({
                next: (exerciseMuscle) => {
                    this.exerciseMuscle = exerciseMuscle;
                    this.imagePath = `/assets/images/${ exerciseMuscle.exercise.id }.gif`;
                },
                error: () => this.router.navigate(['not-found'])
            });
    }

    toggleExerciseWorkout() {
        this.exerciseService.toggleExerciseWorkout(this.exerciseMuscle.exercise)
            .subscribe({
                next: () => this.exerciseMuscle.addedToWorkout = !this.exerciseMuscle.addedToWorkout,
                error: (err) => {
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Impossible d\'enregistrer cet exercice'
                    });
                }
            });
    }

    updateExercise() {
        this.router.navigate(['admin', 'update-exercise', this.exerciseMuscle.exercise.id]);
    }

    protected updateOrder() {
        this.exerciseService.updateOrder(this.exerciseMuscle.exercise, this.formPosition.getRawValue())
            .subscribe({
                next: () => this.alertService.alert$.next({
                    severity: 'success',
                    message: 'L\'ordre a bien été mis à jour'
                }),
                error: (err) => {
                    if (err?.error?.errorCode === 'DUPLICATE_ORDER') {
                        this.formPosition.setErrors({
                            duplicateOrder: true
                        })
                    } else {
                        this.alertService.alert$.next({
                            severity: 'error',
                            message: err?.error?.message ?? 'Impossible de changer l\'ordre'
                        });
                    }
                }
            });
    }
}

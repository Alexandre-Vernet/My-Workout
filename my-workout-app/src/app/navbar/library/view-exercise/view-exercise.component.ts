import { Component, input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ExerciseService } from '../../../services/exercise.service';
import { AlertService } from '../../../services/alert.service';
import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { Skeleton } from 'primeng/skeleton';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../../../interfaces/User';
import { ExerciseMuscle } from '../../../../interfaces/ExerciseMuscle';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "primeng/tabs";
import { DifficultyLabelPipe } from "../../../shared/pipes/difficulty-label.pipe";
import { MechanicLabelPipe } from "../../../shared/pipes/mechanic-label.pipe";

@Component({
    selector: 'app-view-exercise',
    imports: [Button, Tag, Skeleton, Tabs, TabList, Tab, TabPanels, TabPanel, DifficultyLabelPipe, MechanicLabelPipe],
    templateUrl: './view-exercise.component.html',
    styleUrl: './view-exercise.component.scss',
    standalone: true
})
export class ViewExerciseComponent implements OnInit {
    private readonly exerciseService = inject(ExerciseService);
    private readonly alertService = inject(AlertService);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);


    exerciseId = input.required<number>();
    exerciseMuscle!: ExerciseMuscle;
    user: User | undefined;
    imagePath = '';

    ngOnInit() {
        this.authService.getCurrentUser()
            .subscribe(user => this.user = user);

        this.exerciseService.findExerciseMuscle(this.exerciseId())
            .subscribe({
                next: (exerciseMuscle) => {
                    this.exerciseMuscle = exerciseMuscle;
                    this.imagePath = `/assets/images/${ exerciseMuscle.exercise?.id }.gif`;
                },
                error: () => this.router.navigate(['not-found'])
            });
    }

    toggleExerciseWorkout() {
        this.exerciseService.toggleExerciseWorkout(this.exerciseMuscle.exercise!)
            .subscribe({
                next: () => this.exerciseMuscle.addedToWorkout = !this.exerciseMuscle.addedToWorkout,
                error: (err) => {
                    this.alertService.show({
                        severity: 'error',
                        message: err?.error?.message ?? 'Impossible d\'enregistrer cet exercice'
                    });
                }
            });
    }

    updateExercise() {
        this.router.navigate(['admin', 'update-exercise', this.exerciseMuscle.exercise?.id]);
    }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { ExerciseService } from '../../../services/exercise.service';
import { AlertService } from '../../../services/alert.service';
import { UserExerciseService } from '../../../services/user-exercise.service';
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

    exerciseMuscle: ExerciseMuscle;
    user: User;
    imagePath = '';

    constructor(
        private readonly exerciseService: ExerciseService,
        private readonly userExerciseService: UserExerciseService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly alertService: AlertService,
        private readonly authService: AuthService,
        private readonly router: Router
    ) {
    }

    ngOnInit() {
        this.authService.getCurrentUser()
            .subscribe(user => this.user = user);

        this.activatedRoute.params.pipe(
            switchMap((params: {
                exerciseId: number
            }) => this.exerciseService.findExerciseMuscle(Number(params.exerciseId)))
        )
            .subscribe({
                next: (exerciseMuscle) => {
                    this.exerciseMuscle = exerciseMuscle;
                    this.imagePath = `/assets/images/${ exerciseMuscle.exercise.id }.gif`;
                },
                error: () => this.router.navigate(['not-found'])
            });
    }

    toggleExerciseWorkout() {
        this.userExerciseService.toggleExerciseWorkout(this.exerciseMuscle.exercise)
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
}

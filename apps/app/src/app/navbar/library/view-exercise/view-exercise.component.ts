import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { ExerciseService } from '../../../services/exercise.service';
import { Exercise } from '../../../../../../../libs/interfaces/exercise';
import { AlertService } from '../../../services/alert.service';
import { UserExerciseService } from '../../../services/user-exercise.service';
import { Button } from 'primeng/button';
import { Fieldset } from 'primeng/fieldset';
import { Tag } from 'primeng/tag';
import { Drawer } from 'primeng/drawer';

@Component({
    selector: 'app-view-exercise',
    imports: [CommonModule, Button, Fieldset, Tag, Drawer],
    templateUrl: './view-exercise.component.html',
    styleUrl: './view-exercise.component.scss',
    standalone: true
})
export class ViewExerciseComponent implements OnInit {

    exercise: Exercise;

    showDrawerSmartWorkout = false;

    constructor(
        private readonly exerciseService: ExerciseService,
        private readonly userExerciseService: UserExerciseService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly alertService: AlertService
    ) {
    }

    ngOnInit() {
        this.activatedRoute.params.pipe(
            switchMap((params: {
                exerciseId: number
            }) => this.exerciseService.getExercise(Number(params.exerciseId)))
        )
            .subscribe({
                next: (exercise) => {
                    this.exercise = exercise;
                    this.alertService.alert$.next(null);
                },
                error: (err) => {
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Impossible de récupérer les détails de l\'exercice.'
                    });
                }
            });
    }

    toggleExerciseWorkout() {
        return this.userExerciseService.toggleExerciseWorkout(this.exercise)
            .subscribe({
                next: () => {
                    this.exercise.addedToWorkout = !this.exercise.addedToWorkout;
                    this.alertService.alert$.next(null);
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

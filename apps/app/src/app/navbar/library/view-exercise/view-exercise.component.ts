import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { ExerciseService } from '../../../services/exercise.service';
import { Exercise } from '../../../../../../../libs/interfaces/exercise';
import { AlertService } from '../../../services/alert.service';
import { UserExerciseService } from '../../../services/user-exercise.service';
import { Button } from 'primeng/button';
import { Fieldset } from 'primeng/fieldset';
import { Tag } from 'primeng/tag';
import { Drawer } from 'primeng/drawer';
import { DeviceDetectionService } from '../../../services/device-detection.service';
import { Skeleton } from 'primeng/skeleton';
import { replaceSpaces } from '../../../utils/remove-accents';

@Component({
    selector: 'app-view-exercise',
    imports: [CommonModule, Button, Fieldset, Tag, Drawer, Skeleton, RouterLink],
    templateUrl: './view-exercise.component.html',
    styleUrl: './view-exercise.component.scss',
    standalone: true
})
export class ViewExerciseComponent implements OnInit {

    exercise: Exercise;

    showDrawerSmartWorkout = false;

    isIphone = false;

    showImage = true;
    imagePath = '';

    isLoading = true;

    constructor(
        private readonly exerciseService: ExerciseService,
        private readonly userExerciseService: UserExerciseService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly alertService: AlertService,
        private readonly deviceDetectionService: DeviceDetectionService
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
                    this.imagePath = `/assets/images/${ exercise.id }.gif`;
                    this.alertService.alert$.next(null);
                },
                error: (err) => {
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Impossible de récupérer les détails de l\'exercice.'
                    });
                }
            });

        this.isIphone = this.deviceDetectionService.isIphone();
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

    protected readonly replaceSpaces = replaceSpaces;
}

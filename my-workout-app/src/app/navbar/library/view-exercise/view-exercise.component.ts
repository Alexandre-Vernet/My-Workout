import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { ExerciseService } from '../../../services/exercise.service';
import { AlertService } from '../../../services/alert.service';
import { UserExerciseService } from '../../../services/user-exercise.service';
import { Button } from 'primeng/button';
import { Fieldset } from 'primeng/fieldset';
import { Tag } from 'primeng/tag';
import { Drawer } from 'primeng/drawer';
import { DeviceDetectionService } from '../../../services/device-detection.service';
import { Skeleton } from 'primeng/skeleton';
import { replaceSpaces } from '../../../shared/utils/remove-accents';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../../../interfaces/User';
import { ExerciseMuscle } from '../../../../interfaces/ExerciseMuscle';

@Component({
    selector: 'app-view-exercise',
    imports: [Button, Fieldset, Tag, Drawer, Skeleton, RouterLink],
    templateUrl: './view-exercise.component.html',
    styleUrl: './view-exercise.component.scss',
    standalone: true
})
export class ViewExerciseComponent implements OnInit {

    exerciseMuscle: ExerciseMuscle;
    user: User;
    imagePath = '';

    showDrawerSmartWorkout = false;
    isIphone = false;

    constructor(
        private readonly exerciseService: ExerciseService,
        private readonly userExerciseService: UserExerciseService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly alertService: AlertService,
        private readonly deviceDetectionService: DeviceDetectionService,
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
                next: (exercise) => {
                    this.exerciseMuscle = exercise;
                    this.imagePath = `/assets/images/${ exercise.exercise.id }.gif`;
                },
                error: () => this.router.navigate(['not-found'])
            });
        this.isIphone = this.deviceDetectionService.isIphone();
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

    protected readonly replaceSpaces = replaceSpaces;
}

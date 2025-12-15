import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MuscleGroup } from '../../../../interfaces/MuscleGroup';
import { MuscleGroupService } from '../../../services/muscle-group.service';
import { Router, RouterLink } from '@angular/router';
import { MenuUrls } from '../../../shared/menu-urls';
import { forkJoin } from 'rxjs';
import { Tag } from 'primeng/tag';
import { Skeleton } from 'primeng/skeleton';
import { ThemeService } from '../../../shared/theme/theme.service';
import {
    DialogSelectCardioExerciseComponent
} from '../dialog-select-cardio-exercise/dialog-select-cardio-exercise.component';
import { Alert } from '../../../../interfaces/alert';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { AlertService } from '../../../services/alert.service';
import { IonContent } from '@ionic/angular/standalone';
import { ViewWillEnter } from '@ionic/angular';

@Component({
    selector: 'select-muscle-group-workout',
    imports: [CommonModule, RouterLink, Tag, Skeleton, DialogSelectCardioExerciseComponent, ConfirmDialog, IonContent],
    templateUrl: './select-muscle-group-workout.component.html',
    styleUrl: './select-muscle-group-workout.component.scss',
    standalone: true,
    providers: [ConfirmationService]
})
export class SelectMuscleGroupWorkoutComponent implements OnInit, ViewWillEnter {

    protected readonly MenuUrls = MenuUrls;

    muscleGroups: MuscleGroup[] = [];

    isLoading = true;

    isDarkMode = false;

    isOpenModalExerciseCardio = false;

    constructor(
        private readonly muscleGroupService: MuscleGroupService,
        private readonly alertService: AlertService,
        private readonly themeService: ThemeService,
        private readonly confirmationService: ConfirmationService,
        private readonly router: Router
    ) {
    }

    ngOnInit() {
        this.init();
        this.isDarkMode = this.themeService.isDarkMode();
    }

    ionViewWillEnter() {
        this.init();
    }

    private init() {
        forkJoin([
            this.muscleGroupService.findAllMuscleGroupAndCountAddedExercises(),
            this.muscleGroupService.suggestMuscleGroup()
        ])
            .subscribe({
                next: ([muscleGroups, recommendedWorkout]) => {
                    this.isLoading = false;
                    this.muscleGroups = muscleGroups;
                    this.alertService.alert$.next(null);

                    if (recommendedWorkout) {
                        const muscleGroupRecommended = this.muscleGroups.find(m => m.id === recommendedWorkout.id);
                        muscleGroupRecommended.isRecommended = true;
                        this.muscleGroups.sort(m => m.isRecommended ? -1 : 1);
                    }
                },
                error: (err) => {
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Impossible d\'afficher les entraînements'
                    });
                }
            });
    }

    openModalExerciseCardio() {
        // If user has no exercise cardio, show dialog to add these exercises
        const cardioExercise = this.muscleGroups.find(m => m.id === 8);
        if (cardioExercise.exerciseCount <= 0) {
            this.showDialogNoExercisesAdded(cardioExercise.id);
            return;
        }

        this.isOpenModalExerciseCardio = true;
    }


    showAlert(alert: Alert) {
        window.scrollTo(0, 0);
        this.alertService.alert$.next(alert);
    }


    private showDialogNoExercisesAdded(muscleGroupId: number) {
        this.confirmationService.confirm({
            header: 'Attention',
            message: `Vous n'avez ajouté aucun exercice à votre bibliothèque.<br/>Commencez par en ajouter pour pouvoir lancer un entraînement.`,
            closable: true,
            closeOnEscape: true,
            dismissableMask: true,
            icon: 'pi pi-exclamation-triangle',
            acceptButtonProps: {
                label: 'Ajouter'
            },
            rejectButtonProps: {
                label: 'Annuler',
                severity: 'secondary',
                outlined: true
            },
            accept: () => this.router.navigate(['/', 'library', 'muscle-group', muscleGroupId]),
            reject: () => this.router.navigate(['/', 'workout'])
        });
    }
}

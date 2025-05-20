import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MuscleGroup } from '../../../../../../../libs/interfaces/MuscleGroup';
import { MuscleGroupService } from '../../../services/muscle-group.service';
import { Router, RouterLink } from '@angular/router';
import { MenuUrls } from '../../../shared/menu-urls';
import { forkJoin, take } from 'rxjs';
import { Message } from 'primeng/message';
import { Tag } from 'primeng/tag';
import { Skeleton } from 'primeng/skeleton';
import { ThemeService } from '../../../theme/theme.service';
import {
    DialogSelectCardioExerciseComponent
} from '../dialog-select-cardio-exercise/dialog-select-cardio-exercise.component';
import { Alert } from '../../../../../../../libs/interfaces/alert';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
    selector: 'select-muscle-group-workout',
    imports: [CommonModule, RouterLink, Message, Tag, Skeleton, DialogSelectCardioExerciseComponent, ConfirmDialog],
    templateUrl: './select-muscle-group-workout.component.html',
    styleUrl: './select-muscle-group-workout.component.scss',
    standalone: true,
    providers: [ConfirmationService]
})
export class SelectMuscleGroupWorkoutComponent implements OnInit {

    protected readonly MenuUrls = MenuUrls;

    muscleGroups: MuscleGroup[] = [];

    isOpenModalExerciseCardio = false;

    alert: Alert;

    isLoading = true;

    isDarkMode = false;

    constructor(
        private readonly muscleGroupService: MuscleGroupService,
        private readonly themeService: ThemeService,
        private readonly confirmationService: ConfirmationService,
        private readonly router: Router
    ) {
    }

    ngOnInit() {
        forkJoin([
            this.muscleGroupService.findAllMuscleGroupAndCountAddedExercises(),
            this.muscleGroupService.suggestMuscleGroup()
        ])
            .pipe(take(1))
            .subscribe({
                next: ([muscleGroups, recommendedWorkout]) => {
                    this.isLoading = false;
                    this.alert = null;
                    this.muscleGroups = muscleGroups;

                    if (recommendedWorkout) {
                        const muscleGroupRecommended = this.muscleGroups.find(m => m.id === recommendedWorkout.id);
                        muscleGroupRecommended.isRecommended = true;
                        this.muscleGroups.sort(m => m.isRecommended ? -1 : 1);
                    }
                },
                error: (err) => {
                    this.alert = {
                        severity: 'error',
                        message: err?.error?.message ?? 'Impossible d\'afficher les entraînements'
                    };
                }
            });

        this.isDarkMode = this.themeService.isDarkMode();
    }

    openModalExerciseCardio() {
        // If user has no exercise cardio, show dialog to add these exercises
        const cardioExercise = this.muscleGroups.find(m => m.id === 8);
        if (cardioExercise.exerciseCount <= 0) {
            this.showDialogNoExercisesAdded(cardioExercise.id);
        } else {
            this.isOpenModalExerciseCardio = true;
        }
    }


    closeModalExerciseCardio() {
        this.isOpenModalExerciseCardio = false;
    }

    showAlert(alert: Alert) {
        window.scrollTo(0, 0);
        this.alert = alert;
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
            accept: () => {
                this.router.navigate(['/', 'library', 'muscle-group', muscleGroupId]);
            },
            reject: () => {
                this.router.navigate(['/', 'workout']);
            }
        });
    }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Skeleton } from 'primeng/skeleton';
import { ThemeService } from '../../theme/theme.service';
import { WorkoutService } from '../../services/workout.service';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';
import { Workout } from '../../../../../../libs/interfaces/workout';
import { Button } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { GroupedHistory } from '../../../../../../libs/interfaces/history';
import { HistoryService } from '../../services/history.service';
import { HistoryDetailComponent } from './history-detail/history-detail.component';
import { Tag } from 'primeng/tag';
import { MuscleGroup } from '../../../../../../libs/interfaces/MuscleGroup';

@Component({
    selector: 'app-history',
    imports: [CommonModule, Skeleton, ConfirmDialog, Button, Ripple, HistoryDetailComponent, Tag],
    templateUrl: './history.component.html',
    styleUrl: './history.component.scss',
    standalone: true,
    providers: [ConfirmationService]
})
export class HistoryComponent implements OnInit {

    workout: Workout[];
    filterWorkouts: Workout[] = [];
    isLoading = true;

    muscleGroups: MuscleGroup[] = [];
    activeFilter: MuscleGroup;

    isDarkMode = false;


    constructor(
        private readonly workoutService: WorkoutService,
        private readonly historyService: HistoryService,
        private readonly router: Router,
        private readonly themeService: ThemeService,
        private readonly alertService: AlertService,
        private readonly confirmationService: ConfirmationService
    ) {
    }

    ngOnInit() {
        this.getHistories();
        this.isDarkMode = this.themeService.isDarkMode();
    }

    deleteWorkout(groupedHistory: GroupedHistory[], muscleGroupName: string, date: Date) {
        const historyId = groupedHistory.map(g => g.id);

        const newDate = new Date(date);
        this.confirmationService.confirm({
            header: 'Attention',
            message: `Voulez-vous vraiment supprimer l\'entraînement ${ muscleGroupName } du ${ newDate.toLocaleDateString() } ?`,
            closable: true,
            closeOnEscape: true,
            dismissableMask: true,
            icon: 'pi pi-exclamation-triangle',
            acceptButtonProps: {
                label: 'Supprimer'
            },
            rejectButtonProps: {
                label: 'Annuler',
                severity: 'secondary',
                outlined: true
            },
            accept: () => {
                this.historyService.deleteIds(historyId)
                    .subscribe({
                        next: () => {
                            this.getHistories();
                            this.alertService.alert$.next({
                                severity: 'success',
                                message: 'Suppression effectuée'
                            });
                        },
                        error: (err) => {
                            this.alertService.alert$.next({
                                severity: 'error',
                                message: err?.error?.message ?? 'Impossible de supprimer l\'entraînement'
                            });
                        }
                    });
            }
        });
    }

    private getHistories() {
        this.workoutService.find()
            .subscribe({
                next: (workout) => {
                    this.isLoading = false;
                    this.workout = workout;
                    this.filterWorkouts = workout;
                    this.checkNoWorkout();
                    this.getMuscleGroups();
                },
                error: (err) => {
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Impossible d\'afficher l\'historique'
                    });
                }
            });
    }

    private checkNoWorkout() {
        if (!this.workout || this.workout.length === 0) {
            this.confirmationService.confirm({
                header: 'Attention',
                message: `Aucun entraînement trouvé dans l'historique.`,
                closable: false,
                closeOnEscape: false,
                dismissableMask: false,
                icon: 'pi pi-exclamation-triangle',
                rejectVisible: false,
                acceptButtonProps: {
                    label: 'Fermer'
                },
                accept: () => this.router.navigate(['/workout'])
            });
        }
    }

    private getMuscleGroups() {
        this.muscleGroups = [];
        // Filter by name because all cardio exercises has the same id
        this.workout.forEach(w => {
            w.muscleGroups.forEach(mgObj => {
                const name = mgObj.muscleGroup.name;
                if (!this.muscleGroups.some(mg => mg.name === name)) {
                    this.muscleGroups.push(mgObj.muscleGroup);
                }
            });
        });

        this.muscleGroups.sort((a, b) => a.name.localeCompare(b.name));
    }

    filterByMuscleGroup(muscleGroup: MuscleGroup) {
        if (muscleGroup.name === this.activeFilter?.name) {
            this.filterWorkouts = this.workout;
            this.activeFilter = null;
            return;
        }

        this.filterWorkouts = this.workout
            .map(w => ({
                ...w,
                muscleGroups: w.muscleGroups.filter(mg => mg.muscleGroup.name === muscleGroup.name)
            }))
            .filter(w => w.muscleGroups.length > 0);

        this.activeFilter = muscleGroup;
    }
}

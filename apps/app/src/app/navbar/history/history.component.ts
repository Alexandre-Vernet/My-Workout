import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService } from '../../services/history.service';
import { History } from '../../../../../../libs/interfaces/history';
import { Skeleton } from 'primeng/skeleton';
import { ThemeService } from '../../theme/theme.service';
import { Button } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { WorkoutService } from '../../services/workout.service';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { AlertService } from '../../services/alert.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-history',
    imports: [CommonModule, Skeleton, Button, Ripple, ConfirmDialog, RouterLink],
    templateUrl: './history.component.html',
    styleUrl: './history.component.scss',
    standalone: true,
    providers: [ConfirmationService]
})
export class HistoryComponent implements OnInit {

    history: History[];
    isLoading = true;

    isDarkMode = false;


    constructor(
        private readonly historyService: HistoryService,
        private readonly workoutService: WorkoutService,
        private readonly themeService: ThemeService,
        private readonly alertService: AlertService,
        private readonly confirmationService: ConfirmationService
    ) {
    }

    ngOnInit() {
        this.historyService.find()
            .subscribe({
                next: (history) => {
                    this.isLoading = false;
                    this.history = history;
                    this.alertService.alert$.next(null);
                },
                error : (err) => {
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Impossible d\'afficher l\'historique'
                    });
                }
            });

        this.isDarkMode = this.themeService.isDarkMode();
    }

    deleteWorkout(id: number, muscleGroupName: string, date: Date) {
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
                this.workoutService.delete(id)
                    .subscribe({
                        next: () => {
                            this.history = this.history
                                .map(h => ({
                                    ...h,
                                    groups: h.groups.filter(g => g.workoutId !== id)
                                }))
                                .filter(h => h.groups.length > 0);
                            this.alertService.alert$.next(null);
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
}

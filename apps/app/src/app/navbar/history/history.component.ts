import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';
import { HistoryService } from '../../services/history.service';
import { History } from '../../../../../../libs/interfaces/history';
import { Skeleton } from 'primeng/skeleton';
import { ThemeService } from '../../theme/theme.service';
import { Button } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { WorkoutService } from '../../services/workout.service';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { Message } from 'primeng/message';

@Component({
    selector: 'app-history',
    imports: [CommonModule, Skeleton, Button, Ripple, ConfirmDialog, Message],
    templateUrl: './history.component.html',
    styleUrl: './history.component.scss',
    standalone: true,
    providers: [ConfirmationService]
})
export class HistoryComponent implements OnInit {

    history: History[];
    isLoading = true;

    isDarkMode = false;

    errorMessage: string;

    constructor(
      private readonly historyService: HistoryService,
      private readonly workoutService: WorkoutService,
      private readonly themeService: ThemeService,
      private readonly confirmationService: ConfirmationService
    ) {
    }

    ngOnInit() {
        this.historyService.findByUserId()
          .pipe(take(1))
          .subscribe({
              next: (history) => {
                  this.isLoading = false;
                  this.history = history;
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
                  .pipe(take(1))
                  .subscribe({
                      next: () => {
                          this.errorMessage = '';
                          this.history = this.history.map(h => {
                              h.groups = h.groups.filter(g => g.workoutId !== id);
                              return h;
                          });
                      },
                      error: (err) => this.errorMessage = err?.error?.message ?? 'Une erreur est survenue lors de la suppression de l\'entraînement',
                  });
            }
        });
    }
}

import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { Skeleton } from 'primeng/skeleton';
import { UserExercisesCountTotalWorkout } from '../../../interfaces/UserExercisesCountTotalWorkout';
import { HistoryService } from '../../services/history.service';

@Component({
    selector: 'app-stats',
    imports: [RouterLink, Skeleton],
    templateUrl: './stats.component.html',
    styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit {

    userExercisesCountTotalWorkout: UserExercisesCountTotalWorkout;

    constructor(
        private readonly historyService: HistoryService,
        private readonly alertService: AlertService,
    ) {
    }

    ngOnInit() {
        this.historyService.getGlobalStatsWithListExercises()
            .subscribe({
                next: (userExercisesCountTotalWorkout) => this.userExercisesCountTotalWorkout = userExercisesCountTotalWorkout,
                error: (err) => {
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Erreur lors de la récupération des statistiques'
                    });
                }
            });
    }
}

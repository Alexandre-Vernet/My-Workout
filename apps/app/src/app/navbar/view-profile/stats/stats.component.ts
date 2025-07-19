import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseService } from '../../../services/exercise.service';
import { Exercise } from '../../../../../../../libs/interfaces/exercise';
import { RouterLink } from '@angular/router';
import { WorkoutService } from '../../../services/workout.service';
import { AlertService } from '../../../services/alert.service';
import { ThemeService } from '../../../theme/theme.service';
import { Skeleton } from 'primeng/skeleton';

@Component({
    selector: 'app-stats',
    imports: [CommonModule, RouterLink, Skeleton],
    templateUrl: './stats.component.html',
    styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit {

    exercises: Exercise[] = [];

    totalDaysWorkout = 0;

    isLoading = true;
    isDarkMode = false;

    constructor(
        private readonly exerciseService: ExerciseService,
        private readonly workoutService: WorkoutService,
        private readonly alertService: AlertService,
        private readonly themeService: ThemeService
    ) {
    }

    ngOnInit() {
        this.exerciseService.findAddedExercises()
            .subscribe({
                next: (exercises) => {
                    this.isLoading = false;
                    this.exercises = exercises;
                },
                error: (err) => {
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Erreur lors de la récupération des exercices'
                    });
                }
            });

        this.countTotalDaysWorkout();

        this.isDarkMode = this.themeService.isDarkMode();
    }

    private countTotalDaysWorkout() {
        this.workoutService.countTotalDaysWorkout()
            .subscribe({
                next: (totalDaysWorkout => this.totalDaysWorkout = totalDaysWorkout),
                error: (err) => {
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Erreur lors de la récupération du nombre de jour d\'entraînement'
                    });
                }
            });
    }
}

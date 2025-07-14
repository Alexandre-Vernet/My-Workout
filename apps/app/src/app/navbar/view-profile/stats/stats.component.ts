import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseService } from '../../../services/exercise.service';
import { Exercise } from '../../../../../../../libs/interfaces/exercise';
import { RouterLink } from '@angular/router';
import { WorkoutService } from '../../../services/workout.service';
import { AlertService } from '../../../services/alert.service';
import { ThemeService } from '../../../theme/theme.service';

@Component({
    selector: 'app-stats',
    imports: [CommonModule, RouterLink],
    templateUrl: './stats.component.html',
    styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit {

    exercises: Exercise[] = [];

    totalDaysWorkout = 0;

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
                next: (exercises) => this.exercises = exercises
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
                        message: err?.error?.message ?? 'Erreur lors de la récupération des données'
                    });
                }
            });
    }
}

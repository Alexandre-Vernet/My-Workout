import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseService } from '../../../services/exercise.service';
import { Exercise } from '../../../../interfaces/exercise';
import { RouterLink } from '@angular/router';
import { WorkoutService } from '../../../services/workout.service';
import { AlertService } from '../../../services/alert.service';
import { ThemeService } from '../../../theme/theme.service';
import { Skeleton } from 'primeng/skeleton';
import { IonContent } from '@ionic/angular/standalone';
import { ViewWillEnter } from "@ionic/angular";

@Component({
    selector: 'app-stats',
    imports: [CommonModule, RouterLink, Skeleton, IonContent],
    templateUrl: './stats.component.html',
    styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit, ViewWillEnter {

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
        this.init();
        this.isDarkMode = this.themeService.isDarkMode();
    }

    ionViewWillEnter() {
        this.init();
    }

    private init() {
        this.exerciseService.findByUserId()
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService } from '../../../services/history.service';
import Chart, { ChartItem } from 'chart.js/auto';
import { AlertService } from '../../../services/alert.service';
import { ExerciseService } from '../../../services/exercise.service';
import { Exercise } from '../../../interfaces/exercise';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from '../../../theme/theme.service';

@Component({
    selector: 'app-graphs',
    imports: [CommonModule],
    templateUrl: './graphs.component.html',
    styleUrl: './graphs.component.scss',
    standalone: true
})
export class GraphsComponent implements OnInit {

    exercise: Exercise;

    exerciseId = 0;

    totalWeight = 0;
    totalReps = 0;
    maxWeight = 0;

    isDarkMode = false;

    constructor(
        private readonly historyService: HistoryService,
        private readonly exerciseService: ExerciseService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly alertService: AlertService,
        private readonly themeService: ThemeService
    ) {
    }

    ngOnInit() {
        this.exerciseId = Number(this.activatedRoute.snapshot.paramMap.get('exerciseId'));

        this.exerciseService.getExercise(this.exerciseId)
            .subscribe({
                next: (exercise) => {
                    this.exercise = exercise;
                    this.bar();
                    this.countTotalWeight();
                    this.countTotalReps();
                    this.countMaxWeight();
                },
                error: (err) => {
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Erreur lors de la récupération des données'
                    });
                }
            });

        this.isDarkMode = this.themeService.isDarkMode();
    }

    private bar() {
        this.historyService.graphs(this.exerciseId)
            .subscribe({
                next: (histories => {
                    const ctx = document.getElementById('bar');

                    new Chart(ctx as ChartItem, {
                        type: 'bar',
                        data: {
                            labels: histories.map(h => h.date),
                            datasets: [{
                                label: 'Charge utilisée',
                                data: histories.map(h => h.weight),
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: function(value) {
                                            return `${ value } kg`;
                                        }
                                    },
                                    labels: ['test']
                                }
                            }
                        }
                    });
                }),
                error: (err) => {
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Erreur lors de la récupération des données'
                    });
                }
            });
    }

    private countTotalWeight() {
        this.historyService.countTotalWeight(this.exerciseId)
            .subscribe({
                next: (totalWeight => this.totalWeight = totalWeight),
                error: (err) => {
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Erreur lors de la récupération des données'
                    });
                }
            });
    }

    private countTotalReps() {
        this.historyService.countTotalReps(this.exerciseId)
            .subscribe({
                next: (totalReps => this.totalReps = totalReps),
                error: (err) => {
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Erreur lors de la récupération des données'
                    });
                }
            });
    }

    private countMaxWeight() {
        this.historyService.countMaxWeight(this.exerciseId)
            .subscribe({
                next: (maxWeight => this.maxWeight = maxWeight),
                error: (err) => {
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Erreur lors de la récupération des données'
                    });
                }
            });
    }
}

import { Component, inject, input, OnInit } from '@angular/core';
import { HistoryService } from '../../../services/history.service';
import { Router } from '@angular/router';
import { ExerciseGraphs } from '../../../../interfaces/ExerciseGraphs';
import Chart, { ChartItem } from 'chart.js/auto';
import { Skeleton } from 'primeng/skeleton';

@Component({
    selector: 'app-graphs',
    templateUrl: './graphs.component.html',
    styleUrl: './graphs.component.scss',
    imports: [Skeleton],
    standalone: true
})
export class GraphsComponent implements OnInit {

    exerciseId = input.required<number>();
    exerciseGraphs: ExerciseGraphs;

    private readonly historyService = inject(HistoryService);
    private readonly router = inject(Router);

    ngOnInit() {
        this.historyService.getExerciseGraphs(this.exerciseId())
            .subscribe({
                next: (exerciseGraphs) => {
                    this.exerciseGraphs = exerciseGraphs;

                    const ctx = document.getElementById('bar');

                    new Chart(ctx as ChartItem, {
                        type: 'line',

                        data: {
                            labels: this.exerciseGraphs.historyPoints.map(h => new Date(h.date).toLocaleDateString()),
                            datasets: [{
                                label: 'Charge utilisée',
                                data: this.exerciseGraphs.historyPoints.map(h => h.weight),
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: function (value) {
                                            return `${ value } kg`;
                                        }
                                    },
                                }
                            }
                        }
                    });

                },
                error: () => this.router.navigate(['not-found'])
            });
    }
}

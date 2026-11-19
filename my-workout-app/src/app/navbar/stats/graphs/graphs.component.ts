import { Component, ElementRef, inject, input, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
export class GraphsComponent implements OnInit, OnDestroy {

    exerciseId = input.required<number>();
    exerciseGraphs!: ExerciseGraphs;

    @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;

    private chart: Chart | null = null;

    private readonly historyService = inject(HistoryService);
    private readonly router = inject(Router);

    ngOnInit() {
        this.historyService.getExerciseGraphs(this.exerciseId())
            .subscribe({
                next: (exerciseGraphs) => {
                    this.exerciseGraphs = exerciseGraphs;

                    this.chart?.destroy();

                    this.chart = new Chart(this.barCanvas.nativeElement as ChartItem, {
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

    ngOnDestroy() {
        this.chart?.destroy();
    }
}

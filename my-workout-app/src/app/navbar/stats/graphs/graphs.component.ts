import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, OnDestroy, signal, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HistoryService } from '../../../services/history.service';
import { ExerciseGraphs } from '../../../../interfaces/ExerciseGraphs';
import { HistoryPoint } from '../../../../interfaces/HistoryPoint';
import { I18N } from '../../../shared/i18n/i18n';
import Chart, { ChartItem } from 'chart.js/auto';

type Period = '1m' | '3m' | '6m' | '1y' | 'all';

const PERIOD_MONTHS: Record<Exclude<Period, 'all'>, number> = {
    '1m': 1,
    '3m': 3,
    '6m': 6,
    '1y': 12
};

// Beyond this many points, the default period narrows down so the chart stays readable.
const DEFAULT_PERIOD_POINT_THRESHOLD = 30;

@Component({
    selector: 'app-graphs',
    templateUrl: './graphs.component.html',
    styleUrl: './graphs.component.scss',
    imports: [RouterLink],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class GraphsComponent implements OnDestroy {

    exerciseId = input.required<number>();
    protected readonly exerciseGraphs = signal<ExerciseGraphs | undefined>(undefined);

    protected readonly i18n = I18N.stats.graphs;

    protected readonly periods: ReadonlyArray<Period> = ['1m', '3m', '6m', '1y', 'all'];
    protected readonly selectedPeriod = signal<Period>('all');

    @ViewChild('barCanvas') private barCanvas!: ElementRef<HTMLCanvasElement>;

    private chart: Chart<'line', (number | null)[], string> | null = null;

    private readonly historyService = inject(HistoryService);
    private readonly router = inject(Router);

    constructor() {
        effect(() => {
            this.historyService.getExerciseGraphs(this.exerciseId())
                .subscribe({
                    next: (exerciseGraphs) => {
                        this.exerciseGraphs.set(exerciseGraphs);
                        this.selectedPeriod.set(
                            exerciseGraphs.historyPoints.length > DEFAULT_PERIOD_POINT_THRESHOLD ? '3m' : 'all'
                        );
                        this.renderChart();
                    },
                    error: () => this.router.navigate(['not-found'])
                });
        });
    }

    ngOnDestroy() {
        this.chart?.destroy();
    }

    protected setPeriod(period: Period) {
        this.selectedPeriod.set(period);
        this.renderChart();
    }

    protected filteredHistoryPoints(): HistoryPoint[] {
        const historyPoints = this.exerciseGraphs()!.historyPoints;
        const period = this.selectedPeriod();
        if (period === 'all') {
            return historyPoints;
        }

        const threshold = new Date();
        threshold.setMonth(threshold.getMonth() - PERIOD_MONTHS[period]);

        return historyPoints.filter(point => new Date(point.date) >= threshold);
    }

    private renderChart() {
        const points = this.filteredHistoryPoints();
        const labels = points.map(point => new Date(point.date).toLocaleDateString());
        const data = points.map(point => point.weight);
        const pointRadius = points.length > 25 ? 0 : 4;

        if (this.chart) {
            this.chart.data.labels = labels;
            this.chart.data.datasets[0].data = data;
            this.chart.data.datasets[0].pointRadius = pointRadius;
            this.chart.update();
            return;
        }

        const canvas = this.barCanvas.nativeElement;
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--p-primary-color').trim();

        // Falls back to a flat translucent color when no working 2D context is available
        // (e.g. under jsdom in tests), instead of a gradient under the curve.
        let backgroundColor: string | CanvasGradient = `color-mix(in srgb, ${ primaryColor } 20%, transparent)`;
        try {
            const context = canvas.getContext('2d');
            const gradient = context?.createLinearGradient(0, 0, 0, canvas.clientHeight || 240);
            if (gradient) {
                gradient.addColorStop(0, `color-mix(in srgb, ${ primaryColor } 35%, transparent)`);
                gradient.addColorStop(1, 'transparent');
                backgroundColor = gradient;
            }
        } catch {
            // Keep the flat fallback color.
        }

        this.chart = new Chart<'line', (number | null)[], string>(canvas as ChartItem, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: this.i18n.datasetLabel,
                    data,
                    borderColor: primaryColor,
                    backgroundColor,
                    pointBackgroundColor: primaryColor,
                    borderWidth: 2,
                    tension: .35,
                    fill: true,
                    pointRadius
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            autoSkip: true,
                            maxRotation: 0
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => this.i18n.formatWeight(value)
                        }
                    }
                }
            }
        });
    }
}

import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    effect,
    inject,
    input,
    model,
    OnChanges,
    OnInit,
    output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { HistoryService } from '../../../../services/history.service';
import { History } from '../../../../../interfaces/History';
import { AlertService } from '../../../../services/alert.service';
import { getErrorMessage } from '../../../../shared/utils/http-error';
import { NumberStepperComponent } from '../../../../shared/number-stepper/number-stepper.component';

@Component({
    selector: 'app-exercises-table',
    imports: [NumberStepperComponent],
    templateUrl: './exercises-table.component.html',
    styleUrl: './exercises-table.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExercisesTableComponent implements OnInit, OnChanges {
    muscleGroupId = input.required<number>();
    exerciseId = input.required<number>();
    exercisesMade = model.required<History[]>();
    resetWorkout = output<void>();

    @ViewChild('historyScroll') historyScroll!: ElementRef<HTMLElement>;

    private readonly historyService = inject(HistoryService);
    private readonly alertService = inject(AlertService);

    constructor() {
        effect(() => {
            this.exercisesMade();
            setTimeout(() => this.scrollBottomTable(), 100);
        });
    }

    ngOnInit() {
        this.findTodayExercicesHistory();
    }

    ngOnChanges(changes: SimpleChanges) {
        // The initial load is already handled by ngOnInit(); only react to later changes here.
        if (changes['exerciseId'] && !changes['exerciseId'].firstChange
            && changes['exerciseId'].currentValue !== changes['exerciseId'].previousValue) {
            this.findTodayExercicesHistory();
        }
    }

    scrollBottomTable() {
        const container = this.historyScroll?.nativeElement;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    // Allow ony 1/2 fractions
    onWeightChange(history: History, value: number | null) {
        history.weight = value !== null ? Math.round(value * 2) / 2 : undefined;
    }

    onRepsChange(history: History, value: number | null) {
        history.reps = value ?? undefined;
    }

    toggleUnilateral(history: History) {
        this.updateHistory(history, !history.unilateral);
    }

    updateHistory(history: History, value?: boolean) {
        if (typeof value === 'boolean') {
            history.unilateral = value;
        }

        this.historyService.update(history)
            .subscribe({
                next: () =>
                    this.alertService.show({
                        severity: 'success',
                        message: 'Mise à jour réussie'
                    }),
                error: (err) =>
                    this.alertService.show({
                        severity: 'error',
                        message: getErrorMessage(err, 'Impossible de mettre à jour')
                    })
            });
    }

    deleteHistory(history: History) {
        this.historyService.delete(history)
            .subscribe({
                next: () => {
                    this.exercisesMade.update(list => list.filter(e => e.id !== history.id));

                    if (this.exercisesMade().length === 0) {
                        this.resetWorkout.emit();
                    }
                },
                error: (err) =>
                    this.alertService.show({
                        severity: 'error',
                        message: getErrorMessage(err, 'Erreur lors de la suppression')
                    })
            });
    }


    private findTodayExercicesHistory() {
        this.historyService.findTodayExercicesHistory(this.muscleGroupId(), this.exerciseId())
            .subscribe({
                next: (history) => {
                    if (history) {
                        this.exercisesMade.set(history.map(h => ({
                                ...h,
                                restTime: '/'
                            })
                        ));
                    }
                },
                error: (err) => this.alertService.show({
                    severity: 'error',
                    message: getErrorMessage(err, 'Erreur lors de la récupération de l\'historique')
                })
            });
    }
}

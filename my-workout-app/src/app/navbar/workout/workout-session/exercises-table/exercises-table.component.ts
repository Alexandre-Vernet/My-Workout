import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    effect,
    inject,
    input,
    model,
    output,
    untracked,
    ViewChild
} from '@angular/core';
import { HistoryService } from '../../../../services/history.service';
import { History } from '../../../../../interfaces/History';
import { AlertService } from '../../../../services/alert.service';
import { getErrorMessage } from '../../../../shared/utils/http-error';
import { NumberStepperComponent } from '../../../../shared/number-stepper/number-stepper.component';
import { I18N } from '../../../../shared/i18n/i18n';

@Component({
    selector: 'app-exercises-table',
    imports: [NumberStepperComponent],
    templateUrl: './exercises-table.component.html',
    styleUrl: './exercises-table.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExercisesTableComponent {
    protected readonly i18n = I18N.workout.exercisesTable;

    muscleGroupId = input.required<number>();
    exerciseId = input.required<number>();
    exercisesMade = model.required<History[]>();
    resetWorkout = output<void>();

    @ViewChild('historyScroll') private historyScroll!: ElementRef<HTMLElement>;

    private readonly historyService = inject(HistoryService);
    private readonly alertService = inject(AlertService);

    constructor() {
        effect(() => {
            this.exercisesMade();
            setTimeout(() => this.scrollBottomTable(), 100);
        });

        // Only exerciseId is a tracked dependency here: muscleGroupId is fixed for the
        // lifetime of a workout session, reloading today's history only needs to react
        // to the exercise being switched.
        effect(() => {
            this.exerciseId();
            untracked(() => this.findTodayExercicesHistory());
        });
    }

    private scrollBottomTable() {
        const container = this.historyScroll?.nativeElement;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    // Allow ony 1/2 fractions
    protected onWeightChange(history: History, value: number | null) {
        history.weight = value !== null ? Math.round(value * 2) / 2 : undefined;
    }

    protected onRepsChange(history: History, value: number | null) {
        history.reps = value ?? undefined;
    }

    protected toggleUnilateral(history: History) {
        this.updateHistory(history, !history.unilateral);
    }

    protected updateHistory(history: History, value?: boolean) {
        if (typeof value === 'boolean') {
            history.unilateral = value;
        }

        this.historyService.update(history)
            .subscribe({
                next: () =>
                    this.alertService.show({
                        severity: 'success',
                        message: this.i18n.updateSuccessMessage
                    }),
                error: (err) =>
                    this.alertService.show({
                        severity: 'error',
                        message: getErrorMessage(err, this.i18n.updateErrorMessage)
                    })
            });
    }

    protected deleteHistory(history: History) {
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
                        message: getErrorMessage(err, this.i18n.deleteErrorMessage)
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
                    message: getErrorMessage(err, this.i18n.fetchHistoryErrorMessage)
                })
            });
    }
}

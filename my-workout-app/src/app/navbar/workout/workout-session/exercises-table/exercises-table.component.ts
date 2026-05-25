import {
    Component,
    DestroyRef,
    ElementRef,
    inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { HistoryService } from '../../../../services/history.service';
import { InputNumber } from 'primeng/inputnumber';
import { History } from '../../../../../interfaces/History';
import { AlertService } from '../../../../services/alert.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { Checkbox } from "primeng/checkbox";

@Component({
    selector: 'app-exercises-table',
    imports: [TableModule, InputNumber, FormsModule, AsyncPipe, ReactiveFormsModule, Checkbox],
    templateUrl: './exercises-table.component.html',
    styleUrl: './exercises-table.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class ExercisesTableComponent implements OnInit, OnChanges {
    @Input() muscleGroupId: number;
    @Input() exerciseId: number;
    @Input() exercisesMade = new BehaviorSubject<History[]>([]);
    @Output() resetWorkout = new Subject<void>();

    @ViewChild('exerciseTable', { read: ElementRef }) exerciseTable!: ElementRef;

    private destroyRef = inject(DestroyRef);

    constructor(
        private readonly historyService: HistoryService,
        private readonly alertService: AlertService
    ) {
    }

    ngOnInit() {
        this.findTodayExercicesHistory();
        this.exercisesMade
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => setTimeout(() => this.scrollBottomTable(), 100));
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['exerciseId'].currentValue !== changes['exerciseId'].previousValue) {
            this.findTodayExercicesHistory();
        }
    }

    scrollBottomTable() {
        const tableBody: HTMLElement = this.exerciseTable?.nativeElement.querySelector('.p-datatable-table-container');
        if (tableBody) {
            tableBody.scrollTop = tableBody.scrollHeight;
        }
    }

    // Allow ony 1/2 fractions
    onWeightChange(history: History, value: number) {
        history.weight = Math.round(value * 2) / 2;
    }

    updateHistory(history: History, value?: boolean) {
        if (typeof value === 'boolean') {
            history.unilateral = value;
        }

        this.historyService.update(history)
            .subscribe({
                next: () =>
                    this.alertService.alert$.next({
                        severity: 'success',
                        message: 'Mise à jour réussie'
                    }),
                error: (err) =>
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: err.error.message ?? 'Impossible de mettre à jour'
                    })
            });
    }

    deleteHistory(history: History) {
        this.historyService.delete(history)
            .subscribe({
                next: () => {
                    this.exercisesMade.next(this.exercisesMade.getValue().filter(e => e.id !== history.id));

                    if (this.exercisesMade.getValue().length === 0) {
                        this.resetWorkout.next();
                    }
                },
                error: (err) =>
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: err.error.message ?? 'Erreur lors de la suppression'
                    })
            });
    }


    private findTodayExercicesHistory() {
        this.historyService.findTodayExercicesHistory(this.muscleGroupId, this.exerciseId)
            .subscribe({
                next: (history) => {
                    if (history) {
                        this.exercisesMade.next(history.map(h => ({
                                ...h,
                                restTime: '/'
                            })
                        ));
                    }
                },
                error: (err) => this.alertService.alert$.next({
                    severity: 'error',
                    message: err.error.message ?? 'Erreur lors de la récupération de l\'historique'
                })
            });
    }
}

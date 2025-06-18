import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { HistoryService } from '../../../../services/history.service';
import { InputNumber } from 'primeng/inputnumber';
import { History } from '../../../../../../../../libs/interfaces/history';
import { AlertService } from '../../../../services/alert.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-exercises-table',
    imports: [CommonModule, TableModule, InputNumber, FormsModule],
    templateUrl: './exercises-table.component.html',
    styleUrl: './exercises-table.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class ExercisesTableComponent implements OnChanges {
    @Input() muscleGroupId: number;
    @Input() exerciseId: number;
    @Input() exercisesMade: History[] = [];

    @ViewChild('exerciseTable', { read: ElementRef }) exerciseTable!: ElementRef;

    editingField: string;
    updateWeight: number = 0;
    updateReps: number = 0;

    constructor(
        private readonly historyService: HistoryService,
        private readonly alertService: AlertService
    ) {
    }


    ngOnChanges(changes: SimpleChanges) {
        const changeExerciseId = changes['exerciseId'];
        if (changeExerciseId?.currentValue) {
            this.findTodayExercicesHistory();
        }

        const changeExerciseMade = changes['exercisesMade'];
        if (changeExerciseMade?.currentValue) {
            setTimeout(() => this.scrollTable(), 0);
        }
    }

    scrollTable() {
        const tableBody = this.exerciseTable?.nativeElement.querySelector('.p-datatable-table-container');
        if (tableBody) {
            tableBody.scrollTop = tableBody.scrollHeight;
        }
    }

    private findTodayExercicesHistory() {
        this.historyService.findTodayExercicesHistory(this.muscleGroupId, this.exerciseId)
            .subscribe(history => {
                if (history) {
                    history.forEach(h => {
                        const exercise: History = {
                            id: h.id,
                            weight: h.weight,
                            reps: h.reps,
                            restTime: '/'
                        };

                        this.exercisesMade.push(exercise);
                    });
                }
            });
    }

    clickWeight(history: History) {
        this.editingField = `weight-${ history.id }`;
        this.updateWeight = history.weight;
    }

    clickReps(history: History) {
        this.editingField = `reps-${ history.id }`;
        this.updateReps = history.reps;
    }

    updateHistory(history: History) {
        if (this.editingField === `weight-${ history.id }`) {
            history.weight = this.updateWeight;
        } else if (this.editingField === `reps-${ history.id }`) {
            history.reps = this.updateReps;
        }

        this.historyService.update(history)
            .subscribe({
                next: () =>
                    this.alertService.alert$.next({
                        severity: 'success',
                        message: 'History updated successfully'
                    }),
                error: (err) =>
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: err.error.message ?? 'Error updating history'
                    })
            });

        this.editingField = '';
    }
}

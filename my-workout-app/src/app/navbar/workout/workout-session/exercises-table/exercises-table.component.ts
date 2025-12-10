import {
    Component,
    ElementRef,
    Input,
    OnChanges, OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { HistoryService } from '../../../../services/history.service';
import { InputNumber } from 'primeng/inputnumber';
import { History } from '../../../../../interfaces/history';
import { AlertService } from '../../../../services/alert.service';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { ViewWillEnter } from "@ionic/angular";

@Component({
    selector: 'app-exercises-table',
    imports: [CommonModule, TableModule, InputNumber, FormsModule],
    templateUrl: './exercises-table.component.html',
    styleUrl: './exercises-table.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class ExercisesTableComponent implements OnInit, ViewWillEnter, OnChanges {
    @Input() muscleGroupId: number;
    @Input() exerciseId: number;
    @Input() exercisesMade: History[] = [];
    @Output() exercisesMadeChange = new Subject<History[]>();

    @ViewChild('exerciseTable', { read: ElementRef }) exerciseTable!: ElementRef;

    editingField: string;
    updateWeight: number = 0;
    updateReps: number = 0;

    constructor(
        private readonly historyService: HistoryService,
        private readonly alertService: AlertService
    ) {
    }

    ngOnInit() {
        this.findTodayExercicesHistory();
    }

    ionViewWillEnter() {
        this.findTodayExercicesHistory();
    }


    ngOnChanges(changes: SimpleChanges) {
        const exercisesMade = changes['exercisesMade'];
        if (exercisesMade?.currentValue) {
            setTimeout(() => this.scrollTable(), 0);
        }
    }

    scrollTable() {
        const tableBody = this.exerciseTable?.nativeElement.querySelector('.p-datatable-table-container');
        if (tableBody) {
            tableBody.scrollTop = tableBody.scrollHeight;
        }
    }

    roundToQuarter(value: number): number {
        return Math.round(value / 0.25) * 0.25;
    }

    onWeightChange(value: number) {
        this.updateWeight = this.roundToQuarter(value);
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
                        message: 'Mise à jour réussie'
                    }),
                error: (err) =>
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: err.error.message ?? 'Impossible de mettre à jour'
                    })
            });

        this.editingField = '';
    }

    deleteHistory(history: History) {
        this.historyService.delete(history)
            .subscribe({
                next: () => {
                    this.exercisesMade = this.exercisesMade.filter(e => e.id !== history.id);
                    this.exercisesMadeChange.next(this.exercisesMade);
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
                        this.exercisesMade = history.map(h => ({
                                ...h,
                                restTime: '/'
                            })
                        );
                    }
                },
                error: (err) => this.alertService.alert$.next({
                    severity: 'error',
                    message: err.error.message ?? 'Erreur lors de la récupération de l\'historique'
                })
            });
    }
}

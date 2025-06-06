import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Exercise } from '../../../../../../../../libs/interfaces/exercise';
import { HistoryService } from '../../../../services/history.service';

@Component({
    selector: 'app-exercises-table',
    imports: [CommonModule, TableModule],
    templateUrl: './exercises-table.component.html',
    styleUrl: './exercises-table.component.scss'
})
export class ExercisesTableComponent implements OnChanges {
    @Input() muscleGroupId: number;
    @Input() exerciseId: number;
    @Input() exercisesMade: Exercise[] = [];

    @ViewChild('exerciseTable', { read: ElementRef }) exerciseTable!: ElementRef;


    constructor(
        private readonly historyService: HistoryService
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
                        const exercise: Exercise = {
                            id: this.exercisesMade.length + 1,
                            weight: h.weight,
                            reps: h.reps,
                            restTime: '/'
                        };

                        this.exercisesMade.push(exercise);
                    });
                }
            });
    }
}

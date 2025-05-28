import { Component, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Exercise } from '../../../../../../../../libs/interfaces/exercise';
import { take } from 'rxjs';
import { HistoryService } from '../../../../services/history.service';

@Component({
    selector: 'app-exercises-table',
    imports: [CommonModule, TableModule],
    templateUrl: './exercises-table.component.html',
    styleUrl: './exercises-table.component.scss',
})
export class ExercisesTableComponent implements OnChanges {
    @Input() muscleGroupId: number;
    @Input() exerciseId: number;
    @Input() exercisesMade: Exercise[] = [];

    constructor(
        private readonly historyService: HistoryService
    ) {
    }


    ngOnChanges(changes: SimpleChanges): void {
        const change: SimpleChange | undefined = changes['exerciseId'];
        if (change?.currentValue !== undefined) {
            this.findTodayExercicesHistory();
        }
    }

    private findTodayExercicesHistory() {
        this.historyService.findTodayExercicesHistory(this.muscleGroupId, this.exerciseId)
            .pipe(take(1))
            .subscribe(history => {
                if (history) {
                    history.forEach(h => {
                        const exercise: Exercise = {
                            id: this.exercisesMade.length + 1,
                            weight: h.weight,
                            restTime: '/'
                        };

                        this.exercisesMade.push(exercise);
                    });
                }
            });
    }
}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupedHistory } from '../../../../../../../libs/interfaces/history';

@Component({
    selector: 'app-history-detail',
    imports: [CommonModule],
    templateUrl: './history-detail.component.html',
    styleUrl: './history-detail.component.scss',
    standalone: true
})
export class HistoryDetailComponent {

    @Input() groupedHistory: GroupedHistory[];

    formatMinutesToReadableTime(minutes: number): string {
        if (minutes < 60) {
            return `${ minutes } mn`;
        }

        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (remainingMinutes === 0) {
            return `${ hours } h`;
        }

        return `${ hours }h${ remainingMinutes }`;
    }
}

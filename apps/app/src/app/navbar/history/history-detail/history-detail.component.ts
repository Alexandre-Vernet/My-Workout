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
}

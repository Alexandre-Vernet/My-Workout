import { Component, Input } from '@angular/core';
import { History } from '../../../../interfaces/History';
import { Exercise } from '../../../../interfaces/Exercise';
import { RouterLink } from '@angular/router';
import { ConvertTimePipe } from '../../../shared/pipes/convert-time.pipe';

@Component({
    selector: 'app-history-detail',
    imports: [RouterLink, ConvertTimePipe],
    templateUrl: './history-detail.component.html',
    styleUrl: './history-detail.component.scss',
    standalone: true
})
export class HistoryDetailComponent {

    @Input() exercise: Exercise;
    @Input() histories: History[];
}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { History } from '../../../../interfaces/History';
import { Exercise } from '../../../../interfaces/Exercise';
import { RouterLink } from '@angular/router';
import { ConvertTimePipe } from '../../../shared/pipes/convert-time.pipe';
import { I18N } from '../../../shared/i18n/i18n';

@Component({
    selector: 'app-history-detail',
    imports: [RouterLink, ConvertTimePipe],
    templateUrl: './history-detail.component.html',
    styleUrl: './history-detail.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class HistoryDetailComponent {

    exercise = input.required<Exercise>();
    histories = input.required<History[]>();

    protected readonly i18n = I18N.calendar.historyDetail;
}

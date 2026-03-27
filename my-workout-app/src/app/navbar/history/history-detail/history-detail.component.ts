import { Component, Input, OnInit } from '@angular/core';
import { History } from '../../../../interfaces/History';
import { Exercise } from '../../../../interfaces/Exercise';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-history-detail',
    imports: [RouterLink],
    templateUrl: './history-detail.component.html',
    styleUrl: './history-detail.component.scss',
    standalone: true
})
export class HistoryDetailComponent implements OnInit {

    @Input() exercise: Exercise;
    @Input() histories: History[];

    ngOnInit() {
        this.histories = this.histories.map(gp => {
            let durationConvert = '';
            if (typeof gp?.workout?.duration === 'number') {

                if (gp.workout.duration < 60) {
                    durationConvert = `${ gp.workout.duration } mn`;
                } else {
                    const hours = Math.floor(gp.workout.duration / 60);
                    const remainingMinutes = gp.workout.duration % 60;

                    if (remainingMinutes === 0) {
                        durationConvert = `${ hours } h`;
                    } else {
                        durationConvert = `${ hours }h${ remainingMinutes }`;
                    }
                }

                return {
                    ...gp,
                    duration: durationConvert
                };
            }

            return gp;
        });
    }
}

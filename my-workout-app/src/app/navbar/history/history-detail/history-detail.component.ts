import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupedHistory } from '../../../../interfaces/history';
import { Exercise } from '../../../../interfaces/exercise';
import { RouterLink } from '@angular/router';
import { ViewWillEnter } from "@ionic/angular";

@Component({
    selector: 'app-history-detail',
    imports: [CommonModule, RouterLink],
    templateUrl: './history-detail.component.html',
    styleUrl: './history-detail.component.scss',
    standalone: true
})
export class HistoryDetailComponent implements OnInit, ViewWillEnter {

    @Input() exercise: Exercise;
    @Input() groupedHistory: GroupedHistory[];

    ngOnInit() {
        this.init();
    }

    ionViewWillEnter() {
        this.init();
    }

    private init() {
        this.groupedHistory = this.groupedHistory.map(gp => {
            let durationConvert = '';
            if (typeof gp.duration === 'number') {

                if (gp.duration < 60) {
                    durationConvert = `${ gp.duration } mn`;
                } else {
                    const hours = Math.floor(gp.duration / 60);
                    const remainingMinutes = gp.duration % 60;

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

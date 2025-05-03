import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { HistoryService } from '../../services/history.service';
import { take } from 'rxjs';

@Component({
    selector: 'app-calendar',
    imports: [CommonModule, FullCalendarModule],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss',
    standalone: true
})
export class CalendarComponent implements OnInit {

    calendarOptions: CalendarOptions = {
        locale: 'fr',
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        weekends: true,
        events: [],
        firstDay: 1,
        height: 500,
        buttonText: {
            today: 'Aujourd\'hui'
        }
    };

    constructor(
        private readonly historyService: HistoryService
    ) {

    }

    ngOnInit() {
        this.historyService.getHistoryAndMuscleGroupByUserId()
            .pipe(take(1))
            .subscribe(history => {
                this.calendarOptions.events = history.map(h => {
                    return {
                        title: h.name,
                        start: h.createdAt
                    };
                });
            });
    }


    handleDateClick(arg) {
        console.log(arg);
    }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
    selector: 'app-calendar',
    imports: [CommonModule, FullCalendarModule],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss',
    standalone: true
})
export class CalendarComponent {
    calendarOptions: CalendarOptions = {
        locale: 'fr',
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        weekends: true,
        events: [
            {
                title: 'Meeting',
                start: new Date()
            }
        ],
        firstDay: 1,
        height: 500
    };

    handleDateClick(arg) {
        console.log(arg);
    }
}

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { HistoryService } from '../../services/history.service';
import { take } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-calendar',
    imports: [CommonModule, FullCalendarModule, FormsModule, ConfirmDialog],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    providers: [ConfirmationService]
})
export class CalendarComponent implements OnInit, AfterViewInit {

    calendarOptions: CalendarOptions = {
        locale: 'fr',
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        weekends: true,
        events: [],
        firstDay: 1,
        height: 600,
        buttonText: {
            today: 'Aujourd\'hui'
        },
        headerToolbar: {
            left: 'title,prev,next',
            center: '',
            right: 'today'
        },
        eventClick: (info) => {
            const { title, start } = info.event;
            const ids = info.event.id.split(',').map(e => Number(e));

            this.deleteEvent(title, start, ids);
        }
    };

    @ViewChild('swipeZone', { static: true }) swipeZone!: ElementRef<HTMLDivElement>;
    swipeStartX = 0;
    swipeEndX = 0;

    constructor(
        private readonly historyService: HistoryService,
        private readonly confirmationService: ConfirmationService
    ) {

    }

    ngOnInit() {
        this.historyService.getHistoryAndMuscleGroupByUserId()
            .pipe(take(1))
            .subscribe(history => {
                this.calendarOptions.events = history.flatMap(h => {
                    return h.ids.flatMap((id, index) => {
                        const group = h.muscleGroups[index];
                        if (!group) return []; // ← ignore empty or undefined
                        return [{
                            id: id.toString(),
                            title: group,
                            start: h.date
                        }];
                    });
                });
            });
    }


    ngAfterViewInit() {
        const el = this.swipeZone.nativeElement;

        el.addEventListener('touchstart', (e: TouchEvent) => {
            this.swipeStartX = e.changedTouches[0].screenX;
        });

        el.addEventListener('touchend', (e: TouchEvent) => {
            this.swipeEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
    }

    handleSwipe() {
        const deltaX = this.swipeEndX - this.swipeStartX;

        if (Math.abs(deltaX) < 50) return; // Ignore small swipes

        if (deltaX < 0) {
            this.nextMonth();
        } else {
            this.previousMonth();
        }
    }

    private deleteEvent(eventName: string, eventDate: Date, ids: number[]) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            header: 'Attention',
            message: `Voulez-vous vraiment supprimer la séance ${ eventName } du ${ eventDate.toLocaleDateString('fr-FR') } ?`,
            closable: false,
            closeOnEscape: true,
            icon: 'pi pi-exclamation-triangle',
            acceptButtonProps: {
                label: 'Supprimer'
            },
            rejectButtonProps: {
                label: 'Annuler',
                severity: 'secondary',
                outlined: true
            },
            accept: () => {
                this.historyService.delete(ids)
                    .subscribe({
                        next: ({ deletedIds }) => {
                            if (deletedIds) {
                                this.calendarOptions.events = (this.calendarOptions.events as EventInput[]).filter(event => !deletedIds.includes(Number(event.id)));
                            }
                        }
                    });
            }
        });
    }

    private previousMonth() {
        const btnPreviousMonth = document.querySelector('.fc-prev-button') as HTMLButtonElement;
        if (btnPreviousMonth) {
            btnPreviousMonth.click();
        }
    }

    private nextMonth() {
        const btnNextMonth = document.querySelector('.fc-next-button') as HTMLButtonElement;
        if (btnNextMonth) {
            btnNextMonth.click();
        }
    }
}

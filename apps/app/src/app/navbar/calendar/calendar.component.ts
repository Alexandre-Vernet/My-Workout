import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { take } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { WorkoutService } from '../../services/workout.service';

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
            const { id, title, start } = info.event;

            this.deleteEvent(Number(id), title, start);
        }
    };

    @ViewChild('swipeZone', { static: true }) swipeZone!: ElementRef<HTMLDivElement>;
    swipeStartX = 0;
    swipeEndX = 0;

    constructor(
        private readonly workoutService: WorkoutService,
        private readonly confirmationService: ConfirmationService
    ) {

    }

    ngOnInit() {
        this.workoutService.findWorkoutFromUserId()
            .pipe(take(1))
            .subscribe(workout => {
                this.calendarOptions.events = workout.map(w => ({
                        id: w.id.toString(),
                        title: w.muscleGroup.name,
                        start: w.date
                    })
                );
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

    private deleteEvent(id: number, eventName: string, eventDate: Date) {
        this.confirmationService.confirm({
            header: 'Attention',
            message: `Voulez-vous vraiment supprimer la séance ${ eventName } du ${ eventDate.toLocaleDateString() } ?`,
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
                this.workoutService.delete(id)
                    .subscribe({
                        next: ({ deletedId }) => {
                            if (deletedId) {
                                this.calendarOptions.events = (this.calendarOptions.events as EventInput[]).filter(event => Number(event.id) !== deletedId);
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

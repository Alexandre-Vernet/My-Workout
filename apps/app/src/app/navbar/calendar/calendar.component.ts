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
import { Workout } from '../../../../../../libs/interfaces/workout';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { ThemeService } from '../../theme/theme.service';
import { removeAccents } from '../../utils/remove-accents';
import { muscleGroupMap } from '../../../../../../libs/interfaces/MuscleGroup';

@Component({
    selector: 'app-calendar',
    imports: [CommonModule, FullCalendarModule, FormsModule, ConfirmDialog, Dialog, Button, Message],
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
        eventClick: (info) => this.viewHistory(Number(info.event.id)),
        eventDidMount(info) {
            const eventNameFormated = removeAccents(info.event.title);
            const label: string = muscleGroupMap[eventNameFormated]?.label ?? info.event.title;
            const color: string = muscleGroupMap[eventNameFormated]?.color || '#e67c73';

            const spanEventName = info.el.querySelector('span.text-sm') as HTMLElement;
            if (spanEventName) {
                spanEventName.textContent = label;
            }

            info.el.style.borderLeft = `4px solid ${ color }`;
            info.el.style.paddingLeft = '3px';
        }
    };

    workout: Workout;
    showModalViewWorkout = false;

    @ViewChild('swipeZone', { static: true }) swipeZone!: ElementRef<HTMLDivElement>;
    swipeStartX = 0;
    swipeEndX = 0;


    isDarkMode = false;

    errorMessage: string;

    constructor(
        private readonly workoutService: WorkoutService,
        private readonly confirmationService: ConfirmationService,
        private readonly themeService: ThemeService
    ) {

    }

    ngOnInit() {
        this.workoutService.findAll()
            .pipe(take(1))
            .subscribe(workout => {
                this.calendarOptions.events = workout.map(w => ({
                        id: w.id.toString(),
                        title: w.muscleGroup.name,
                        start: w.date
                    })
                );
            });

        this.isDarkMode = this.themeService.isDarkMode();
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

    openModalDeleteWorkout(id: number, muscleGroupName: string, date: Date) {
        const formattedDate = new Date(date);
        this.confirmationService.confirm({
            header: 'Attention',
            message: `Voulez-vous vraiment supprimer l'entraînement ${ muscleGroupName } du ${ formattedDate.toLocaleDateString() } ?`,
            closable: true,
            closeOnEscape: true,
            dismissableMask: true,
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
                        next: () => {
                            this.errorMessage = '';
                            this.calendarOptions.events = (this.calendarOptions.events as EventInput[]).filter(event => Number(event.id) !== id);
                        },
                        error: (err) => this.errorMessage = err?.error?.message ?? 'Une erreur est survenue lors de la suppression de l\'entraînement'
                    });
                this.showModalViewWorkout = false;
            }
        });
    }

    private viewHistory(id: number) {
        this.workoutService.findById(id)
            .pipe(take(1))
            .subscribe(workout => {
                this.showModalViewWorkout = true;
                this.workout = workout;
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

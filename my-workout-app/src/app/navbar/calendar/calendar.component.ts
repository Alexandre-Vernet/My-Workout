import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventInput, EventMountArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FormsModule } from '@angular/forms';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { WorkoutService } from '../../services/workout.service';
import { Workout } from '../../../interfaces/workout';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { ThemeService } from '../../shared/theme/theme.service';
import { removeAccents } from '../../shared/utils/remove-accents';
import { MuscleGroup, muscleGroupMap } from '../../../interfaces/MuscleGroup';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import {
    DialogSelectCardioExerciseComponent
} from '../workout/dialog-select-cardio-exercise/dialog-select-cardio-exercise.component';
import { Alert } from '../../../interfaces/alert';
import { AlertService } from '../../services/alert.service';
import { Tag } from 'primeng/tag';
import { ExerciseService } from '../../services/exercise.service';
import { HistoryDetailComponent } from '../history/history-detail/history-detail.component';
import { Exercise } from '../../../interfaces/exercise';

@Component({
    selector: 'app-calendar',
    imports: [CommonModule, FullCalendarModule, FormsModule, ConfirmDialog, Dialog, Button, DialogSelectCardioExerciseComponent, Tag, HistoryDetailComponent],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    providers: [ConfirmationService]
})
export class CalendarComponent implements OnInit, AfterViewInit {

    @ViewChild('calendarComponent', { static: false }) calendarComponent!: FullCalendarComponent;
    calendarOptions: CalendarOptions = {
        timeZone: 'local',
        locale: 'fr',
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        weekends: true,
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
        eventClick: this.viewHistory.bind(this),
        eventDidMount: this.customizeCalendar.bind(this),
        dateClick: this.dateClick.bind(this),
        events: ((info, success, failure) => {
            const { start, end } = info;

            this.workoutService.findByDate(start, end)
                .subscribe({
                    next: (workouts) => {
                        this.workouts = workouts;

                        this.filterWorkouts = this.activeFilter
                            ? workouts.filter(w => w.muscleGroup.name === this.activeFilter.name)
                            : workouts;

                        this.getMuscleGroups();

                        const events: EventInput[] = this.filterWorkouts.map(w => {
                            const start = new Date(w.date);
                            const end = new Date(start);
                            end.setSeconds(end.getSeconds() + 1);

                            return {
                                id: w.id.toString(),
                                title: w.muscleGroup.name,
                                start,
                                end
                            };
                        });

                        success(events);
                    },
                    error: (err) => failure(err)
                });
        })
    };

    workouts: Workout[] = [];
    filterWorkouts: Workout[] = [];
    activeFilter: MuscleGroup;

    showWorkout: Workout;
    showModalViewWorkout = false;

    muscleGroups: MuscleGroup[] = [];

    cardioExercises: Exercise[] = [];

    @ViewChild('swipeZone', { static: true }) swipeZone!: ElementRef<HTMLDivElement>;
    swipeStartX = 0;
    swipeEndX = 0;

    setWorkoutDate: Date;
    isOpenModalExerciseCardio = false;

    isDarkMode = false;

    constructor(
        private readonly workoutService: WorkoutService,
        private readonly exerciseService: ExerciseService,
        private readonly confirmationService: ConfirmationService,
        private readonly alertService: AlertService,
        private readonly themeService: ThemeService
    ) {

    }

    ngOnInit() {
        setTimeout(() => this.calendarComponent.getApi().refetchEvents(), 0);
        this.exerciseService.findCardioExercises()
            .subscribe({
                next: (exercises) => this.cardioExercises = exercises
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
            message: `Voulez-vous vraiment supprimer l'entraînement ${muscleGroupName} du ${formattedDate.toLocaleDateString()} ?`,
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
                            this.workouts = this.workouts.filter(w => w.id !== id);
                            this.calendarComponent.getApi().refetchEvents();
                            this.getMuscleGroups();

                            this.alertService.alert$.next({
                                severity: 'success',
                                message: 'Suppression effectuée'
                            });
                        },
                        error: (err) => {
                            this.alertService.alert$.next({
                                severity: 'error',
                                message: err?.error?.message ?? 'Impossible de supprimer l\'entraînement'
                            });
                        }
                    });
                this.showModalViewWorkout = false;
            }
        });
    }

    createdWorkout(workout: Workout) {
        this.workouts.push(workout);
        this.calendarComponent.getApi().refetchEvents();

        this.alertService.alert$.next({
            severity: 'success',
            message: `${workout.history[0].exercise.name} a été ajouté au calendrier`
        });
    }

    showAlert(alert: Alert) {
        window.scrollTo(0, 0);
        this.alertService.alert$.next(alert);
    }


    private getMuscleGroups() {
        this.muscleGroups = [];
        // Filter by name because all cardio exercises has the same id
        this.workouts.forEach(w => {
            if (!this.muscleGroups.some(mg => mg.name === w.muscleGroup.name)) {
                this.muscleGroups.push(w.muscleGroup);
            }
        });

        this.muscleGroups.sort((a, b) => a.name.localeCompare(b.name));
    }

    private viewHistory(info: EventClickArg) {
        const workoutId = Number(info.event.id);
        this.workoutService.findById(workoutId)
            .subscribe(workout => {
                this.showModalViewWorkout = true;
                this.showWorkout = workout;
            });
    }

    filterByMuscleGroup(muscleGroup: MuscleGroup) {
        if (muscleGroup.name === this.activeFilter?.name) {
            this.filterWorkouts = this.workouts;
            this.calendarComponent.getApi().refetchEvents();
            this.activeFilter = null;
            return;
        }

        this.filterWorkouts = this.workouts.filter(w => w.muscleGroup.name === muscleGroup.name);
        this.calendarComponent.getApi().refetchEvents();
        this.activeFilter = muscleGroup;
    }

    private customizeCalendar(info: EventMountArg) {
        const eventNameFormated = removeAccents(info.event.title);
        const label: string = muscleGroupMap[eventNameFormated]?.label ?? info.event.title;
        const color: string = muscleGroupMap[eventNameFormated]?.color || '#e67c73';

        const spanEventName = info.el.querySelector('span.text-sm') as HTMLElement;
        if (spanEventName) {
            spanEventName.textContent = label;
        }

        info.el.classList.add('event-color-style');
        info.el.style.borderLeftColor = color;

    }

    private dateClick(info: DateClickArg) {
        if (this.cardioExercises.length > 0) {
            this.isOpenModalExerciseCardio = true;
            // Set day to info.date but hour to current time
            this.setWorkoutDate = new Date(info.date);
            this.setWorkoutDate.setHours(new Date().getHours(), new Date().getMinutes(), 0, 0);
        } else {
            this.alertService.alert$.next({
                severity: 'error',
                message: 'Aucun exercice cardio n\'a été ajouté, ajoutez en un depuis la bibliothèque'
            });
        }
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

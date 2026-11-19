import { Component, inject, OnInit, signal } from '@angular/core';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { WorkoutService } from '../../services/workout.service';
import { Workout } from '../../../interfaces/Workout';
import { getMuscleGroupColor } from '../../shared/utils/muscle-group-color';
import { MuscleGroup } from '../../../interfaces/MuscleGroup';
import { AlertService } from '../../services/alert.service';
import { HistoryDetailComponent } from './history-detail/history-detail.component';
import { WorkoutGroupedHistories } from '../../../interfaces/WorkoutGroupedHistories';
import { FirstLetterUppercasePipe } from '../../shared/pipes/first-letter-uppercase.pipe';
import { SwipeDirective } from '../../shared/directives/swipe.directive';

interface CalendarDay {
    readonly day: number;
    readonly date: Date;
    readonly isToday: boolean;
    readonly workouts: readonly Workout[];
    readonly dotColors: readonly string[];
    readonly muted: boolean;
}

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MAX_VISIBLE_DOTS = 3;
const SKELETON_DAYS_COUNT = 35;

@Component({
    selector: 'app-calendar',
    imports: [ConfirmDialog, HistoryDetailComponent, FirstLetterUppercasePipe, SwipeDirective],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss',
    standalone: true,
    providers: [ConfirmationService]
})
export class CalendarComponent implements OnInit {

    protected readonly weekdays = WEEKDAYS;

    protected displayedMonth = CalendarComponent.startOfMonth(new Date());
    protected calendarDays: (CalendarDay | null)[] = [];
    protected monthLabel = '';
    protected sessionCountLabel = '';
    protected readonly transitionClass = signal<'' | 'slide-prev' | 'slide-next'>('');

    protected readonly sheetOpen = signal(false);
    protected sheetDateLabel = '';
    protected sheetWorkouts: WorkoutGroupedHistories[] = [];

    workouts: Workout[] = [];
    activeFilter: MuscleGroup | null = null;
    muscleGroups: MuscleGroup[] = [];
    loading = true;

    protected readonly skeletonDays = Array.from({ length: SKELETON_DAYS_COUNT });

    private readonly workoutService = inject(WorkoutService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly alertService = inject(AlertService);

    ngOnInit() {
        this.loadMonth();
    }

    protected previousMonth() {
        this.changeMonth(-1);
    }

    protected nextMonth() {
        this.changeMonth(1);
    }

    protected filterByMuscleGroup(muscleGroup: MuscleGroup) {
        if (muscleGroup.name === this.activeFilter?.name) {
            this.clearMuscleGroupFilter();
            return;
        }

        this.activeFilter = muscleGroup;
        this.buildCalendarDays();
    }

    protected clearMuscleGroupFilter() {
        this.activeFilter = null;
        this.buildCalendarDays();
    }

    protected onDayClick(calendarDay: CalendarDay) {
        if (calendarDay.workouts.length === 0) {
            return;
        }

        this.openDaySheet(calendarDay);
    }

    protected closeSheet() {
        this.sheetOpen.set(false);
    }

    protected openModalDeleteWorkout(id: number, muscleGroupName: string, date: Date) {
        this.sheetOpen.set(false);
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
                            this.workouts = this.workouts.filter(w => w.id !== id);
                            this.getMuscleGroups();
                            this.buildCalendarDays();

                            this.alertService.show({
                                severity: 'success',
                                message: 'Suppression effectuée'
                            });
                        },
                        error: (err) => {
                            this.alertService.show({
                                severity: 'error',
                                message: err?.error?.message ?? 'Impossible de supprimer l\'entraînement'
                            });
                        }
                    });
            }
        });
    }

    protected groupColor(muscleGroupName: string | null | undefined): string {
        return getMuscleGroupColor(muscleGroupName);
    }

    private changeMonth(direction: 1 | -1) {
        this.transitionClass.set(direction === 1 ? 'slide-next' : 'slide-prev');
        setTimeout(() => this.transitionClass.set(''), 320);

        this.displayedMonth = new Date(this.displayedMonth.getFullYear(), this.displayedMonth.getMonth() + direction, 1);
        this.loadMonth();
    }

    private openDaySheet(calendarDay: CalendarDay) {
        this.sheetDateLabel = calendarDay.date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });

        forkJoin(calendarDay.workouts.map(w => this.workoutService.findById(w.id!)))
            .subscribe(groupedHistories => {
                this.sheetWorkouts = groupedHistories;
                this.sheetOpen.set(true);
            });
    }

    private loadMonth() {
        const year = this.displayedMonth.getFullYear();
        const month = this.displayedMonth.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const start = new Date(year, month, 1);
        const end = new Date(year, month, daysInMonth);

        this.monthLabel = this.displayedMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

        this.workoutService.findByDate(start, end)
            .subscribe({
                next: (workouts) => {
                    this.workouts = workouts;
                    this.getMuscleGroups();
                    this.buildCalendarDays();
                    this.loading = false;
                },
                error: (err) => {
                    this.loading = false;
                    this.alertService.show({
                        severity: 'error',
                        message: err?.error?.message ?? 'Impossible d\'afficher le calendrier'
                    });
                }
            });
    }

    private getMuscleGroups() {
        this.muscleGroups = [];
        // Filter by name because all cardio exercises has the same id
        this.workouts.forEach(w => {
            if (w.muscleGroup && !this.muscleGroups.some(mg => mg.name === w.muscleGroup?.name)) {
                this.muscleGroups.push(w.muscleGroup);
            }
        });

        this.muscleGroups.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
    }

    private buildCalendarDays() {
        const year = this.displayedMonth.getFullYear();
        const month = this.displayedMonth.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startOffset = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-first
        const today = new Date();

        const days: (CalendarDay | null)[] = new Array(startOffset).fill(null);
        let daysWithSessions = 0;

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const workoutsThatDay = this.workouts.filter(w => CalendarComponent.isSameDay(new Date(w.date), date));
            const visibleWorkouts = this.activeFilter
                ? workoutsThatDay.filter(w => w.muscleGroup?.name === this.activeFilter?.name)
                : workoutsThatDay;

            if (workoutsThatDay.length > 0) {
                daysWithSessions++;
            }

            days.push({
                day,
                date,
                isToday: CalendarComponent.isSameDay(date, today),
                workouts: workoutsThatDay,
                dotColors: visibleWorkouts.slice(0, MAX_VISIBLE_DOTS).map(w => getMuscleGroupColor(w.muscleGroup?.name)),
                muted: workoutsThatDay.length > 0 && this.activeFilter !== null && visibleWorkouts.length === 0
            });
        }

        this.calendarDays = days;
        this.sessionCountLabel = `${ daysWithSessions } séance${ daysWithSessions > 1 ? 's' : '' } ce mois-ci`;
    }

    private static isSameDay(a: Date, b: Date): boolean {
        return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    }

    private static startOfMonth(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }
}

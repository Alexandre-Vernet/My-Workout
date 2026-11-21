import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { WorkoutService } from '../../services/workout.service';
import { Workout } from '../../../interfaces/Workout';
import { getMuscleGroupColor, getMuscleGroupLabel } from '../../shared/utils/muscle-group-color';
import { MuscleGroup } from '../../../interfaces/MuscleGroup';
import { AlertService } from '../../services/alert.service';
import { HistoryDetailComponent } from './history-detail/history-detail.component';
import { WorkoutGroupedHistories } from '../../../interfaces/WorkoutGroupedHistories';
import { FirstLetterUppercasePipe } from '../../shared/pipes/first-letter-uppercase.pipe';
import { SwipeDirective } from '../../shared/directives/swipe.directive';
import { CustomError } from '../../../interfaces/CustomError';
import { getErrorMessage } from '../../shared/utils/http-error';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { I18N } from '../../shared/i18n/i18n';

interface CalendarDay {
    readonly day: number;
    readonly date: Date;
    readonly isToday: boolean;
    readonly workouts: readonly Workout[];
    readonly dotColors: readonly string[];
    readonly muted: boolean;
}

interface PendingWorkoutDeletion {
    readonly id: number;
    readonly message: string;
}

const MAX_VISIBLE_DOTS = 3;
const SKELETON_DAYS_COUNT = 35;

@Component({
    selector: 'app-calendar',
    imports: [HistoryDetailComponent, FirstLetterUppercasePipe, SwipeDirective, ConfirmDialogComponent],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class CalendarComponent {

    protected readonly i18n = I18N.calendar.calendar;
    protected readonly weekdays = this.i18n.weekdays;

    protected displayedMonth = CalendarComponent.startOfMonth(new Date());
    protected readonly calendarDays = signal<(CalendarDay | null)[]>([]);
    protected monthLabel = '';
    protected readonly sessionCountLabel = signal('');
    protected readonly transitionClass = signal<'' | 'slide-prev' | 'slide-next'>('');

    protected readonly sheetOpen = signal(false);
    protected sheetDateLabel = '';
    protected readonly sheetWorkouts = signal<WorkoutGroupedHistories[]>([]);

    private workouts: Workout[] = [];
    protected activeFilter: MuscleGroup | null = null;
    protected readonly muscleGroups = signal<MuscleGroup[]>([]);
    protected readonly loading = signal(true);

    protected readonly skeletonDays = Array.from({ length: SKELETON_DAYS_COUNT });
    protected readonly pendingWorkoutDeletion = signal<PendingWorkoutDeletion | null>(null);

    private readonly workoutService = inject(WorkoutService);
    private readonly alertService = inject(AlertService);

    constructor() {
        effect(() => this.loadMonth());
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
        const formattedDate = new Date(date).toLocaleDateString();
        this.pendingWorkoutDeletion.set({
            id,
            message: this.i18n.deleteConfirm(muscleGroupName, formattedDate)
        });
    }

    protected confirmDeleteWorkout() {
        const pending = this.pendingWorkoutDeletion();
        this.pendingWorkoutDeletion.set(null);
        if (!pending) {
            return;
        }

        this.workoutService.delete(pending.id)
            .subscribe({
                next: () => {
                    this.workouts = this.workouts.filter(w => w.id !== pending.id);
                    this.getMuscleGroups();
                    this.buildCalendarDays();

                    this.alertService.show({
                        severity: 'success',
                        message: this.i18n.deleteSuccess
                    });
                },
                error: (err: CustomError) => {
                    this.alertService.show({
                        severity: 'error',
                        message: getErrorMessage(err, this.i18n.deleteError)
                    });
                }
            });
    }

    protected cancelDeleteWorkout() {
        this.pendingWorkoutDeletion.set(null);
    }

    protected groupColor(muscleGroupName: string | null | undefined): string {
        return getMuscleGroupColor(muscleGroupName);
    }

    // Days with a session, most recent first, respecting the active muscle group filter
    // (a day fully filtered out by `buildCalendarDays()` is flagged `muted`).
    protected get monthSessionDays(): CalendarDay[] {
        return this.calendarDays()
            .filter((day): day is CalendarDay => day !== null && day.workouts.length > 0 && !day.muted)
            .slice()
            .reverse();
    }

    protected weekdayLabel(date: Date): string {
        return this.weekdays[(date.getDay() + 6) % 7];
    }

    protected dayGroupsLabel(day: CalendarDay): string {
        const relevantWorkouts = this.activeFilter
            ? day.workouts.filter(w => w.muscleGroup?.name === this.activeFilter?.name)
            : day.workouts;

        return [...new Set(relevantWorkouts.map(w => getMuscleGroupLabel(w.muscleGroup?.name)))].join(' · ');
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
                this.sheetWorkouts.set(groupedHistories);
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
                    this.loading.set(false);
                },
                error: (err: CustomError) => {
                    this.loading.set(false);
                    this.alertService.show({
                        severity: 'error',
                        message: getErrorMessage(err, this.i18n.loadError)
                    });
                }
            });
    }

    private getMuscleGroups() {
        const muscleGroups: MuscleGroup[] = [];
        // Filter by name because all cardio exercises has the same id
        this.workouts.forEach(w => {
            if (w.muscleGroup && !muscleGroups.some(mg => mg.name === w.muscleGroup?.name)) {
                muscleGroups.push(w.muscleGroup);
            }
        });

        muscleGroups.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
        this.muscleGroups.set(muscleGroups);
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

        this.calendarDays.set(days);
        this.sessionCountLabel.set(this.i18n.sessionCount(daysWithSessions));
    }

    private static isSameDay(a: Date, b: Date): boolean {
        return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    }

    private static startOfMonth(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }
}

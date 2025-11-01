import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter, map } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExerciseService } from '../../../services/exercise.service';
import { Step, StepList, StepPanel, StepPanels, Stepper } from 'primeng/stepper';
import { FormsModule } from '@angular/forms';
import { Exercise } from '../../../../interfaces/exercise';
import { InputNumber } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { HistoryService } from '../../../services/history.service';
import { History } from '../../../../interfaces/history';
import { Skeleton } from 'primeng/skeleton';
import { ExercisesTableComponent } from './exercises-table/exercises-table.component';
import { Elastic } from '../../../../interfaces/elastic';
import { Popover } from 'primeng/popover';
import { DeviceDetectionService } from '../../../services/device-detection.service';
import { WorkoutService } from '../../../services/workout.service';
import { Workout } from '../../../../interfaces/workout';
import { MuscleGroup } from '../../../../interfaces/MuscleGroup';
import { ErrorCode } from '../../../../error-code/error-code';
import { ThemeService } from '../../../theme/theme.service';
import { AlertService } from '../../../services/alert.service';
import { convertWeightElastic } from '../../../utils/convert-weight-elastic';
import { animate, group, query, style, transition, trigger } from '@angular/animations';
import { PreventFocusOnButtonClickDirective } from '../../../directives/prevent-focus-on-button-click.directive';
import { Haptics, ImpactStyle } from "@capacitor/haptics";

@Component({
    selector: 'app-workout-session',
    imports: [CommonModule, Stepper, StepList, Step, StepPanels, StepPanel, FormsModule, InputNumber, TableModule, ConfirmDialog, FaIconComponent, Skeleton, ExercisesTableComponent, Popover, RouterLink, PreventFocusOnButtonClickDirective],
    templateUrl: './workout-session.component.html',
    styleUrl: './workout-session.component.scss',
    standalone: true,
    providers: [ConfirmationService],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('slidePanel', [
            transition('void => right', [
                style({ transform: 'translateX(100%)', opacity: 0 }),
                animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
            ]),
            transition('void => left', [
                style({ transform: 'translateX(-100%)', opacity: 0 }),
                animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
            ]),
            transition('left => right', [
                query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
                group([
                    query(':leave', [
                        style({ transform: 'translateX(0)', opacity: 1 }),
                        animate('300ms ease-out', style({ transform: 'translateX(-100%)', opacity: 0 }))
                    ], { optional: true }),
                    query(':enter', [
                        style({ transform: 'translateX(100%)', opacity: 0 }),
                        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
                    ], { optional: true })
                ])
            ]),
            transition('right => left', [
                query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
                group([
                    query(':leave', [
                        style({ transform: 'translateX(0)', opacity: 1 }),
                        animate('300ms ease-out', style({ transform: 'translateX(100%)', opacity: 0 }))
                    ], { optional: true }),
                    query(':enter', [
                        style({ transform: 'translateX(-100%)', opacity: 0 }),
                        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
                    ], { optional: true })
                ])
            ])
        ])
    ]
})
export class WorkoutSessionComponent implements OnInit, AfterViewInit {

    workout: Workout;
    exercises: Exercise[] = [];
    exercisesMade: History[] = [];
    currentExercise: Exercise;
    muscleGroupId: number;

    activeStep: number = 1;

    weight: number;
    reps: number = 8;

    timer = {
        startTime: 0,
        text: '00:00:00',
        minutes: 0,
        seconds: 0,
        centiseconds: 0,
        interval: null
    };

    faIcons = {
        faPause,
        faPlay
    };

    isLoading = true;

    isDarkMode = false;

    weightToElastics: Elastic[] = [];

    @ViewChild('swipeZone', { static: true }) swipeZone!: ElementRef<HTMLDivElement>;
    @ViewChild('stepper', { static: false }) stepper!: ElementRef<HTMLDivElement>;
    swipeStartX = 0;
    swipeEndX = 0;

    isIphone = false;

    animationDirection: 'left' | 'right' = 'right';

    private currentTab: number;

    hapticsImpactLight = async () => {
        await Haptics.impact({ style: ImpactStyle.Medium });
    };

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly workoutService: WorkoutService,
        private readonly exerciseService: ExerciseService,
        private readonly historyService: HistoryService,
        private readonly alertService: AlertService,
        private readonly themeService: ThemeService,
        private readonly confirmationService: ConfirmationService,
        private readonly router: Router,
        private readonly deviceDetectionService: DeviceDetectionService
    ) {
    }

    ngOnInit() {
        this.muscleGroupId = Number(this.activatedRoute.snapshot.paramMap.get('muscleGroupId'));
        this.getCurrentTabFromUrl();
        this.findExercises();
        this.isIphone = this.deviceDetectionService.isIphone();
        this.isDarkMode = this.themeService.isDarkMode();
    }

    ngAfterViewInit() {
        const swipeZoneElement = this.swipeZone.nativeElement;

        swipeZoneElement.addEventListener('touchstart', (e: TouchEvent) => {
            this.swipeStartX = e.changedTouches[0].screenX;
        });

        swipeZoneElement.addEventListener('touchend', (e: TouchEvent) => {
            this.swipeEndX = e.changedTouches[0].screenX;
            this.handleSwipe(e);
        });
    }

    handleSwipe(event: TouchEvent) {
        const stepperEl = this.stepper.nativeElement;
        const eventTarget = event.target as Node;

        // Ignore swipe from stepper
        if (stepperEl.contains(eventTarget)) {
            return;
        }

        const deltaX = this.swipeEndX - this.swipeStartX;

        if (Math.abs(deltaX) < 65) return; // Ignore small swipes

        if (deltaX < 0) {
            this.nextStep();
        } else {
            this.previousStep();
        }
    }

    saveExercise() {
        const history: History = {
            workout: this.workout,
            exercise: this.currentExercise,
            weight: this.weight,
            reps: this.reps
        };

        this.historyService.create(history)
            .subscribe({
                next: (h) => {
                    const exerciseMade: History = {
                        id: h.id,
                        weight: this.weight,
                        reps: this.reps,
                        restTime: '/'
                    };

                    this.exercisesMade = [...this.exercisesMade, exerciseMade];

                    this.alertService.alert$.next(null);
                },
                error: (err) => {
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Impossible d\'enregister l\'historique'
                    });
                }
            });
    }

    async toggleTimer() {
        if (this.weight < 0 || this.weight >= 500) {
            return;
        }

        if (this.timer.interval !== null) {
            await this.hapticsImpactLight();
            this.stopTimer();
        } else {
            await this.hapticsImpactLight();
            this.startTimer();
        }
    }

    switchPanel(exercise: Exercise, index?: number) {
        if (this.currentTab === index) {
            return;
        }
        this.currentExercise = exercise;
        this.fillInputWeightRepsLastSavedValue();
        this.exercisesMade = [];
        this.stopTimer();
        this.setTabUrl(index);
        this.reps = 8;
    }


    convertWeightToElastics() {
        this.weightToElastics = convertWeightElastic(this.weight);
    }

    private findExercises() {
        this.exerciseService.findAddedExercisesByMuscleGroupId(this.muscleGroupId)
            .pipe(
                map(exercises => {
                    if (!exercises || exercises.length === 0) {
                        this.showDialogNoExercisesAdded(this.muscleGroupId);
                        return null;
                    }

                    return exercises;
                }),
                filter(exercises => !!exercises)
            )
            .subscribe({
                next: (exercises) => {
                    this.isLoading = false;
                    this.exercises = exercises;
                    this.currentExercise = this.exercises[this.activeStep - 1];
                    if (!this.currentExercise) {
                        this.currentExercise = this.exercises[0];
                        this.switchPanel(this.currentExercise);
                    }
                    this.fillInputWeightRepsLastSavedValue();
                    this.alertService.alert$.next(null);
                },
                error: (err) => {
                    this.isLoading = false;

                    if (err?.error?.errorCode === ErrorCode.muscleGroupDoesntExist) {
                        this.redirectWorkoutHome();
                    }
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Impossible d\'afficher les exercices'
                    });
                }
            });

    }


    private nextStep() {
        if (this.activeStep < this.exercises.length) {
            const oldStep = this.activeStep;
            this.activeStep++;
            this.animationDirection = this.activeStep > oldStep ? 'right' : 'left';

            const nextExercise = this.exercises[this.activeStep - 1];
            this.switchPanel(nextExercise, this.activeStep);
        }
    }

    private previousStep() {
        if (this.activeStep > 1) {
            const oldStep = this.activeStep;
            this.activeStep--;
            this.animationDirection = this.activeStep < oldStep ? 'left' : 'right';

            const previousExercise = this.exercises[this.activeStep - 1];
            this.switchPanel(previousExercise, this.activeStep);
        }
    }

    private getCurrentTabFromUrl() {
        this.activatedRoute.queryParams
            .subscribe(params => {
                const tabParam = +params['tab'];
                if (!tabParam) {
                    this.setTabUrl(1);
                }
                this.currentTab = tabParam || 1;
                this.activeStep = this.currentTab;
            });
    }

    private setTabUrl(index: number) {
        if (index !== null) {
            this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: { tab: index },
                queryParamsHandling: 'merge'
            });
        }
    }


    private fillInputWeightRepsLastSavedValue() {
        this.historyService.findLastHistoryWeightByExerciseId(this.currentExercise.id)
            .subscribe(history => {
                this.weight = history?.weight;
                this.convertWeightToElastics();

                if (history?.reps) {
                    this.reps = history?.reps;
                } else {
                    this.reps = 8;
                }
            });
    }

    private startTimer() {
        if (!this.workout) {
            this.createWorkout(this.muscleGroupId)
                .subscribe(workout => {
                    this.workout = workout;
                    this.saveExercise();
                });
        } else {
            this.saveExercise();
        }

        this.timer.startTime = performance.now();
        this.timer.interval = setInterval(() => {
            const elapsed = performance.now() - this.timer.startTime;

            const centiseconds = Math.floor(elapsed / 10) % 100;
            const seconds = Math.floor(elapsed / 1000) % 60;
            const minutes = Math.floor(elapsed / 60000);

            this.timer.centiseconds = centiseconds;
            this.timer.seconds = seconds;
            this.timer.minutes = minutes;
            this.timer.text = this.formatTimer(this.timer.minutes, this.timer.seconds, this.timer.centiseconds);
        }, 10);
    }

    private stopTimer() {
        if (this.exercisesMade.length > 0) {
            const { minutes, seconds, centiseconds } = this.timer;
            this.exercisesMade[this.exercisesMade.length - 1].restTime = this.formatTimer(minutes, seconds, centiseconds);
        }

        clearInterval(this.timer.interval);
        this.timer.interval = null;
        this.timer = {
            ...this.timer,
            minutes: 0,
            seconds: 0,
            centiseconds: 0
        };

        this.timer.text = this.formatTimer(this.timer.minutes, this.timer.seconds, this.timer.centiseconds);
    }

    /*
        Format : MM:SS:CS
        Exemple : 02:05:72
     */
    private formatTimer(minutes: number, seconds: number, centiseconds: number) {
        return `${ minutes.toString().padStart(2, '0') }:${ seconds.toString().padStart(2, '0') }:${ centiseconds.toString().padStart(2, '0') }`;
    }


    private showDialogNoExercisesAdded(muscleGroupId: number) {
        this.confirmationService.confirm({
            header: 'Attention',
            message: `Vous n'avez ajouté aucun exercice à votre bibliothèque.<br/>Commencez par en ajouter pour pouvoir lancer un entraînement.`,
            closable: true,
            closeOnEscape: true,
            dismissableMask: true,
            icon: 'pi pi-exclamation-triangle',
            acceptButtonProps: {
                label: 'Ajouter'
            },
            rejectButtonProps: {
                label: 'Annuler',
                severity: 'secondary',
                outlined: true
            },
            accept: () => {
                this.router.navigate(['/', 'library', 'muscle-group', muscleGroupId]);
            },
            reject: () => this.redirectWorkoutHome()
        });
    }

    private createWorkout(muscleGroupId: number) {
        const muscleGroup: MuscleGroup = {
            id: muscleGroupId
        };

        const workout: Workout = {
            muscleGroup,
            date: new Date()
        };
        return this.workoutService.create(workout);
    }


    private redirectWorkoutHome() {
        this.router.navigate(['/', 'workout']);
    }
}

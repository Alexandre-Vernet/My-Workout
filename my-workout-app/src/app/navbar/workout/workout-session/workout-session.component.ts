import { AfterViewInit, Component, DestroyRef, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, filter, map } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Step, StepList, StepPanel, StepPanels, Stepper } from 'primeng/stepper';
import { FormsModule } from '@angular/forms';
import { Exercise } from '../../../../interfaces/Exercise';
import { InputNumber } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { HistoryService } from '../../../services/history.service';
import { History } from '../../../../interfaces/History';
import { Skeleton } from 'primeng/skeleton';
import { ExercisesTableComponent } from './exercises-table/exercises-table.component';
import { Elastic } from '../../../../interfaces/elastic';
import { Popover } from 'primeng/popover';
import { WorkoutService } from '../../../services/workout.service';
import { Workout } from '../../../../interfaces/Workout';
import { MuscleGroup } from '../../../../interfaces/MuscleGroup';
import { AlertService } from '../../../services/alert.service';
import { convertWeightElastic } from '../../../shared/utils/convert-weight-elastic';
import { PreventFocusOnButtonClickDirective } from '../../../shared/directives/prevent-focus-on-button-click.directive';
import { NgClass, UpperCasePipe } from '@angular/common';
import { UserExerciseService } from '../../../services/user-exercise.service';
import { UserExercise } from '../../../../interfaces/User-exercise';
import { CustomError } from "../../../../interfaces/CustomError";
import { MuscleGroupEnum } from "../../../../interfaces/MuscleGroupEnum";
import { DEFAULT_VALUE_REST_TIME, RestTimeService } from "../../../services/rest-time.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: 'app-workout-session',
    imports: [Stepper, StepList, Step, StepPanels, StepPanel, FormsModule, InputNumber, TableModule, ConfirmDialog, Skeleton, ExercisesTableComponent, Popover, RouterLink, PreventFocusOnButtonClickDirective, NgClass, UpperCasePipe],
    templateUrl: './workout-session.component.html',
    styleUrl: './workout-session.component.scss',
    standalone: true,
    providers: [ConfirmationService],
    encapsulation: ViewEncapsulation.None,
})
export class WorkoutSessionComponent implements OnInit, AfterViewInit {

    protected readonly DEFAULT_VALUE_REST_TIME = DEFAULT_VALUE_REST_TIME;

    workout: Workout;
    userExercises: UserExercise[] = [];
    exercisesMade = new BehaviorSubject<History[]>([]);
    currentExercise: Exercise;
    muscleGroupEnum: MuscleGroupEnum;

    activeStep: number = 1;

    weight: number;
    reps: number = 8;

    restTime = DEFAULT_VALUE_REST_TIME;

    weightToElastics: Elastic[] = [];

    @ViewChild('swipeZone', { static: true }) swipeZone!: ElementRef<HTMLDivElement>;
    @ViewChild('stepper', { static: false }) stepper!: ElementRef<HTMLDivElement>;
    swipeStartX = 0;
    swipeEndX = 0;

    animationDirection: 'left' | 'right' = 'right';
    animationId = 0;
    private currentTab: number;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly workoutService: WorkoutService,
        private readonly userExerciseService: UserExerciseService,
        private readonly historyService: HistoryService,
        private readonly alertService: AlertService,
        private readonly confirmationService: ConfirmationService,
        private readonly router: Router,
        private readonly restTimeService: RestTimeService,
        private readonly destroyRef: DestroyRef
    ) {
    }

    ngOnInit() {
        this.muscleGroupEnum = Number(this.activatedRoute.snapshot.paramMap.get('muscleGroupId'));
        this.workout = null;
        this.getCurrentTabFromUrl();
        this.findExercises();

        this.restTimeService.restTime$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(restTime => this.restTime = restTime);
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

    toggleTimer() {
        if (this.weight < 0 || this.weight >= 500) {
            return;
        }

        if (this.restTime !== DEFAULT_VALUE_REST_TIME) {
            this.stopTimer();
        } else {
            this.startTimer();
            this.createWorkout();
        }
    }

    switchPanel(exercise: Exercise, index?: number) {
        if (this.currentTab === index) {
            return;
        }
        this.animationId++;
        this.currentExercise = exercise;
        this.fillInputWeightRepsLastSavedValue();
        this.exercisesMade.next([]);
        this.stopTimer();
        this.setTabUrl(index);
        this.reps = 8;
    }


    convertWeightToElastics() {
        this.weightToElastics = convertWeightElastic(this.weight);
    }

    resetWorkout() {
        this.workout = null;
    }

    private findExercises() {
        this.userExerciseService.findAddedExercisesByMuscleGroupId(this.muscleGroupEnum)
            .pipe(
                map(exercises => {
                    if (!exercises || exercises.length === 0) {
                        this.showDialogNoExercisesAdded(this.muscleGroupEnum);
                        return null;
                    }

                    return exercises;
                }),
                filter(exercises => !!exercises)
            )
            .subscribe({
                next: (exercises) => {
                    this.userExercises = exercises;
                    this.currentExercise = exercises[this.activeStep - 1].exercise;
                    if (!this.currentExercise) {
                        this.currentExercise = this.userExercises[0].exercise;
                        this.switchPanel(this.currentExercise);
                    }
                    this.fillInputWeightRepsLastSavedValue();
                },
                error: (err: CustomError) => {
                    if (err?.error?.errorCode === 'muscleGroupDoesntExist') {
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
        if (this.activeStep < this.userExercises.length) {
            const oldStep = this.activeStep;
            this.activeStep++;
            this.animationDirection = this.activeStep > oldStep ? 'right' : 'left';

            const nextExercise = this.userExercises[this.activeStep - 1];
            this.switchPanel(nextExercise.exercise, this.activeStep);
            this.animationDirection = 'right';
        }
    }

    private previousStep() {
        if (this.activeStep > 1) {
            const oldStep = this.activeStep;
            this.activeStep--;
            this.animationDirection = this.activeStep < oldStep ? 'left' : 'right';

            const previousExercise = this.userExercises[this.activeStep - 1];
            this.switchPanel(previousExercise.exercise, this.activeStep);
            this.animationDirection = 'left';
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
        this.restTimeService.startTimer();
    }

    private stopTimer() {
        if (this.exercisesMade.getValue().length > 0) {
            const minutes = this.restTime.split(':')[0].trim();
            const seconds = this.restTime.split(':')[1].trim();
            const centiseconds = this.restTime.split(':')[2].trim();
            this.exercisesMade.getValue()[this.exercisesMade.getValue().length - 1].restTime = `${minutes}:${seconds}:${centiseconds}`;
        }

        this.restTimeService.stopTimer();
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
                this.router.navigate(['/', 'library', 'list-exercises-muscle-group', muscleGroupId]);
            },
            reject: () => this.redirectWorkoutHome()
        });
    }

    private createWorkout() {
        const history: History = {
            exercise: this.currentExercise,
            weight: this.weight,
            reps: this.reps
        };

        const muscleGroup: MuscleGroup = {
            id: this.muscleGroupEnum
        };

        const workout: Workout = {
            muscleGroup,
            date: new Date()
        };

        this.workoutService.create(workout, history)
            .subscribe({
                next: (workout) => {
                    this.workout = workout;
                    const lastHistoryId = workout.histories[workout.histories.length - 1].id;
                    const exerciseMade: History = {
                        id: lastHistoryId,
                        weight: this.weight,
                        reps: this.reps,
                        restTime: '/'
                    };

                    this.exercisesMade.next([
                        ...this.exercisesMade.value,
                        exerciseMade
                    ]);
                },
                error: () => {
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: 'Erreur lors de l\'enregistrement'
                    });
                }
            });
    }

    private redirectWorkoutHome() {
        this.router.navigate(['/', 'workout']);
    }
}

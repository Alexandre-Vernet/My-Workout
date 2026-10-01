import {
    AfterViewInit,
    Component,
    DestroyRef, effect,
    ElementRef,
    inject, input,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { BehaviorSubject, filter, map } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Step, StepList, StepPanel, StepPanels, Stepper } from 'primeng/stepper';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { CustomError } from "../../../../interfaces/CustomError";
import { MuscleGroupEnum } from "../../../../interfaces/MuscleGroupEnum";
import { DEFAULT_VALUE_REST_TIME, RestTimeService } from "../../../services/rest-time.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ToggleSwitch } from "primeng/toggleswitch";
import { ExerciseService } from '../../../services/exercise.service';

@Component({
    selector: 'app-workout-session',
    imports: [Stepper, StepList, Step, StepPanels, StepPanel, FormsModule, InputNumber, TableModule, ConfirmDialog, Skeleton, ExercisesTableComponent, Popover, RouterLink, PreventFocusOnButtonClickDirective, NgClass, UpperCasePipe, ReactiveFormsModule, ToggleSwitch],
    templateUrl: './workout-session.component.html',
    styleUrl: './workout-session.component.scss',
    standalone: true,
    providers: [ConfirmationService],
    encapsulation: ViewEncapsulation.None,
})
export class WorkoutSessionComponent implements OnInit, AfterViewInit {

    protected readonly DEFAULT_VALUE_REST_TIME = DEFAULT_VALUE_REST_TIME;

    muscleGroupId = input.required<number>();
    tab = input<number>(1, {
        transform: (value: string) => value !== null ? Number(value) : null
    });

    workout: Workout;
    exercises: Exercise[] = [];
    exercisesMade = new BehaviorSubject<History[]>([]);
    currentExercise: Exercise;
    muscleGroupEnum: MuscleGroupEnum;

    activeStep: number = 1;
    restTime = DEFAULT_VALUE_REST_TIME;

    formWorkout = new FormGroup({
        weight: new FormControl<number>({
                value: null,
                disabled: this.restTime !== DEFAULT_VALUE_REST_TIME
            },
            [Validators.min(0), Validators.max(1000)]
        ),
        reps: new FormControl<number>({
                value: 8,
                disabled: this.restTime !== DEFAULT_VALUE_REST_TIME
            },
            [Validators.required, Validators.min(1), Validators.max(100)]
        ),
        unilateral: new FormControl<boolean>(false, [Validators.required])
    });


    weightToElastics: Elastic[] = [];

    @ViewChild('swipeZone', { static: true }) swipeZone!: ElementRef<HTMLDivElement>;
    @ViewChild('stepper', { static: false }) stepper!: ElementRef<HTMLDivElement>;
    swipeStartX = 0;
    swipeEndX = 0;

    animationDirection: 'left' | 'right' = 'right';
    animationId = 0;
    private currentTab: number;

    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly workoutService = inject(WorkoutService);
    private readonly exerciseService = inject(ExerciseService);
    private readonly historyService = inject(HistoryService);
    private readonly alertService = inject(AlertService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly router = inject(Router);
    private readonly restTimeService = inject(RestTimeService);
    private readonly destroyRef = inject(DestroyRef);

    constructor() {
        effect(() => {
            if (!this.tab()) {
                this.setTabUrl(1);
            }
            this.currentTab = this.tab() ?? 1;
            this.activeStep = this.currentTab;
        });
    }

    ngOnInit() {
        this.muscleGroupEnum = this.muscleGroupId();
        this.workout = null;
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
        if (this.restTime !== DEFAULT_VALUE_REST_TIME) {
            this.stopTimer();
        } else {
            this.restTimeService.saveRestTimeInfo({
                muscleGroup: this.muscleGroupEnum,
                tab: this.currentTab
            });
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
    }


    convertWeightToElastics() {
        this.weightToElastics = convertWeightElastic(this.formWorkout.controls.weight.value);
    }

    resetWorkout() {
        this.workout = null;
    }

    private findExercises() {
        this.exerciseService.findAddedExercisesByMuscleGroupId(this.muscleGroupEnum)
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
                    this.exercises = exercises;
                    this.currentExercise = exercises[this.activeStep - 1];
                    if (!this.currentExercise) {
                        this.currentExercise = this.exercises[0];
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
        if (this.activeStep < this.exercises.length) {
            const oldStep = this.activeStep;
            this.activeStep++;
            this.animationDirection = this.activeStep > oldStep ? 'right' : 'left';

            const nextExercise = this.exercises[this.activeStep - 1];
            this.switchPanel(nextExercise, this.activeStep);
            this.animationDirection = 'right';
        }
    }

    private previousStep() {
        if (this.activeStep > 1) {
            const oldStep = this.activeStep;
            this.activeStep--;
            this.animationDirection = this.activeStep < oldStep ? 'left' : 'right';

            const previousExercise = this.exercises[this.activeStep - 1];
            this.switchPanel(previousExercise, this.activeStep);
            this.animationDirection = 'left';
        }
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
                this.formWorkout.patchValue({
                    weight: history?.weight,
                    reps: history?.reps ?? 8,
                    unilateral: history?.unilateral ?? false
                });

                this.convertWeightToElastics();
            });
    }

    private startTimer() {
        this.restTimeService.startTimer();
        this.formWorkout.disable();
    }

    private stopTimer() {
        if (this.exercisesMade.getValue().length > 0) {
            const minutes = this.restTime.split(':')[0].trim();
            const seconds = this.restTime.split(':')[1].trim();
            const centiseconds = this.restTime.split(':')[2].trim();
            this.exercisesMade.getValue()[this.exercisesMade.getValue().length - 1].restTime = `${ minutes }:${ seconds }:${ centiseconds }`;
        }

        this.restTimeService.stopTimer();
        this.formWorkout.enable();
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
        const { weight, reps, unilateral } = this.formWorkout.getRawValue();
        const history: History = {
            exercise: this.currentExercise,
            weight,
            reps,
            unilateral
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
                        weight,
                        reps,
                        unilateral,
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

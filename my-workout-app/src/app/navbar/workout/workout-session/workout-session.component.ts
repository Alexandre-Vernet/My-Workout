import {
    Component,
    effect,
    inject,
    input,
    OnInit,
    signal
} from '@angular/core';
import { filter, map } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Exercise } from '../../../../interfaces/Exercise';
import { HistoryService } from '../../../services/history.service';
import { History } from '../../../../interfaces/History';
import { ExercisesTableComponent } from './exercises-table/exercises-table.component';
import { WorkoutService } from '../../../services/workout.service';
import { Workout } from '../../../../interfaces/Workout';
import { MuscleGroup } from '../../../../interfaces/MuscleGroup';
import { AlertService } from '../../../services/alert.service';
import { UpperCasePipe } from '@angular/common';
import { CustomError } from "../../../../interfaces/CustomError";
import { MuscleGroupEnum } from "../../../../interfaces/MuscleGroupEnum";
import { DEFAULT_VALUE_REST_TIME, RestTimeService } from "../../../services/rest-time.service";
import { ExerciseService } from '../../../services/exercise.service';
import { NO_EXERCISES_DIALOG } from '../../../shared/utils/confirm-no-exercises-dialog';
import { getErrorMessage } from '../../../shared/utils/http-error';
import { RestTimePipe } from "../../../shared/pipes/rest-time.pipe";
import { SwipeDirective } from '../../../shared/directives/swipe.directive';
import { NumberStepperComponent } from '../../../shared/number-stepper/number-stepper.component';
import { ToggleSwitchComponent } from '../../../shared/toggle-switch/toggle-switch.component';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-workout-session',
    imports: [
        ExercisesTableComponent,
        RouterLink,
        UpperCasePipe,
        RestTimePipe,
        SwipeDirective,
        NumberStepperComponent,
        ToggleSwitchComponent,
        ConfirmDialogComponent
    ],
    templateUrl: './workout-session.component.html',
    styleUrl: './workout-session.component.scss',
    standalone: true
})
export class WorkoutSessionComponent implements OnInit {

    protected readonly DEFAULT_VALUE_REST_TIME = DEFAULT_VALUE_REST_TIME;
    protected readonly NO_EXERCISES_DIALOG = NO_EXERCISES_DIALOG;
    protected readonly confirmNoExercisesOpen = signal(false);

    muscleGroupId = input.required<number>();
    tab = input<number, string>(1, {
        transform: (value: string) => value !== null ? Number(value) : 1
    });

    workout: Workout | null = null;
    exercises: Exercise[] = [];
    exercisesMade = signal<History[]>([]);
    currentExercise!: Exercise;
    muscleGroupEnum!: MuscleGroupEnum;

    activeStep: number = 1;

    formWorkout = new FormGroup({
        weight: new FormControl<number | null>({ value: null, disabled: false },
            [Validators.min(0), Validators.max(1000)]
        ),
        reps: new FormControl<number>({ value: 8, disabled: false },
            [Validators.required, Validators.min(1), Validators.max(100)]
        ),
        unilateral: new FormControl<boolean>(false, [Validators.required])
    });

    animationDirection: 'left' | 'right' = 'right';
    animationId = 0;
    private currentTab!: number;

    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly workoutService = inject(WorkoutService);
    private readonly exerciseService = inject(ExerciseService);
    private readonly historyService = inject(HistoryService);
    private readonly alertService = inject(AlertService);
    private readonly router = inject(Router);
    protected readonly restTimeService = inject(RestTimeService);

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
    }

    toggleTimer() {
        if (this.restTimeService.restTime() !== DEFAULT_VALUE_REST_TIME) {
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
        this.exercisesMade.set([]);
        this.stopTimer();
        this.setTabUrl(index);
    }

    protected onWeightChange(value: number | null) {
        this.formWorkout.controls.weight.setValue(value);
    }

    protected onRepsChange(value: number | null) {
        this.formWorkout.controls.reps.setValue(value ?? 1);
    }

    protected onUnilateralChange(value: boolean) {
        this.formWorkout.controls.unilateral.setValue(value);
    }

    resetWorkout() {
        this.workout = null;
    }

    protected confirmAddExercises() {
        this.confirmNoExercisesOpen.set(false);
        this.router.navigate(['/', 'library'], { queryParams: { muscleGroup: this.muscleGroupEnum } });
    }

    protected cancelAddExercises() {
        this.confirmNoExercisesOpen.set(false);
        this.redirectWorkoutHome();
    }

    private findExercises() {
        this.exerciseService.findAddedExercisesByMuscleGroupId(this.muscleGroupEnum)
            .pipe(
                map(exercises => {
                    if (!exercises || exercises.length === 0) {
                        this.confirmNoExercisesOpen.set(true);
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
                    this.alertService.show({
                        severity: 'error',
                        message: getErrorMessage(err, 'Impossible d\'afficher les exercices')
                    });
                }
            });
    }


    protected nextStep() {
        if (this.activeStep < this.exercises.length) {
            const oldStep = this.activeStep;
            this.activeStep++;
            this.animationDirection = this.activeStep > oldStep ? 'right' : 'left';

            const nextExercise = this.exercises[this.activeStep - 1];
            this.switchPanel(nextExercise, this.activeStep);
            this.animationDirection = 'right';
        }
    }

    protected previousStep() {
        if (this.activeStep > 1) {
            const oldStep = this.activeStep;
            this.activeStep--;
            this.animationDirection = this.activeStep < oldStep ? 'left' : 'right';

            const previousExercise = this.exercises[this.activeStep - 1];
            this.switchPanel(previousExercise, this.activeStep);
            this.animationDirection = 'left';
        }
    }

    private setTabUrl(index?: number) {
        if (index !== undefined) {
            this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: { tab: index },
                queryParamsHandling: 'merge'
            });
        }
    }

    private fillInputWeightRepsLastSavedValue() {
        this.historyService.findLastHistoryWeightByExerciseId(this.currentExercise.id!)
            .subscribe(history => {
                this.formWorkout.patchValue({
                    weight: history?.weight,
                    reps: history?.reps ?? 8,
                    unilateral: history?.unilateral ?? false
                });
            });
    }

    private startTimer() {
        this.restTimeService.startTimer();
        this.formWorkout.disable();
    }

    private stopTimer() {
        if (this.exercisesMade().length > 0) {
            const { minutes, seconds, centiseconds } = this.restTimeService.restTime();
            const formattedRestTime = `${ minutes.toString().padStart(2, '0') }:${ seconds.toString().padStart(2, '0') }:${ centiseconds.toString().padStart(2, '0') }`;

            this.exercisesMade.update(list => {
                const last = list[list.length - 1];
                return [...list.slice(0, -1), { ...last, restTime: formattedRestTime }];
            });
        }

        this.restTimeService.stopTimer();
        this.formWorkout.enable();
    }

    private createWorkout() {
        const { weight, reps, unilateral } = this.formWorkout.getRawValue();
        const history: History = {
            exercise: this.currentExercise,
            weight: weight ?? undefined,
            reps: reps ?? undefined,
            unilateral: unilateral ?? undefined
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
                    const histories = workout.histories ?? [];
                    const lastHistoryId = histories[histories.length - 1].id;
                    const exerciseMade: History = {
                        id: lastHistoryId,
                        weight: weight ?? undefined,
                        reps: reps ?? undefined,
                        unilateral: unilateral ?? undefined,
                        restTime: '/'
                    };

                    this.exercisesMade.update(list => [...list, exerciseMade]);
                },
                error: () => {
                    this.alertService.show({
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

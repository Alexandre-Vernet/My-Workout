import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter, map, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ExerciseService } from '../../../services/exercise.service';
import { Step, StepList, StepPanel, StepPanels, Stepper } from 'primeng/stepper';
import { FormsModule } from '@angular/forms';
import { Exercise } from '../../../../../../../libs/interfaces/exercise';
import { InputNumber } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { HistoryService } from '../../../services/history.service';
import { History } from '../../../../../../../libs/interfaces/history';
import { Skeleton } from 'primeng/skeleton';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { ExercisesTableComponent } from './exercises-table/exercises-table.component';
import { Elastic, elastics } from '../../../../../../../libs/interfaces/elastic';
import { Popover } from 'primeng/popover';
import { DeviceDetectionService } from '../../../services/device-detection.service';
import { WorkoutService } from '../../../services/workout.service';
import { Workout } from '../../../../../../../libs/interfaces/workout';
import { MuscleGroup } from '../../../../../../../libs/interfaces/MuscleGroup';
import { ErrorCode } from '../../../../../../../libs/error-code/error-code';
import { ThemeService } from '../../../theme/theme.service';
import { AlertService } from '../../../services/alert.service';

@Component({
    selector: 'app-workout-session',
    imports: [CommonModule, Stepper, StepList, Step, StepPanels, StepPanel, FormsModule, InputNumber, TableModule, ConfirmDialog, FaIconComponent, Skeleton, ButtonDirective, Ripple, ExercisesTableComponent, Popover],
    templateUrl: './workout-session.component.html',
    styleUrl: './workout-session.component.scss',
    standalone: true,
    providers: [ConfirmationService],
    encapsulation: ViewEncapsulation.None

})
export class WorkoutSessionComponent implements OnInit, AfterViewInit {

    workout: Workout;
    exercises: Exercise[] = [];
    exercisesMade: Exercise[] = [];
    currentExercise: Exercise;
    muscleGroupId: number;

    activeStep: number = 1;

    weight: number = 0;

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
    swipeStartX = 0;
    swipeEndX = 0;

    isIphone = false;


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
        this.checkDuplicateWorkout();
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
            this.handleSwipe();
        });
    }

    handleSwipe() {
        const deltaX = this.swipeEndX - this.swipeStartX;

        if (Math.abs(deltaX) < 50) return; // Ignore small swipes

        if (deltaX < 0) {
            this.nextStep();
        } else {
            this.previousStep();
        }
    }

    decreaseWeight() {
        if (!this.weight) {
            return;
        }
        this.weight = Number(this.weight) - 2.5;
        this.convertWeightToElastics();
    }

    increaseWeight() {
        if (this.weight >= 500) {
            return;
        }
        this.weight = Number(this.weight) + 2.5;
        this.convertWeightToElastics();
    }


    saveExercise() {
        const weightNumber = Number(this.weight) > 0 ? this.weight : null;

        const exerciseMade: Exercise = {
            id: this.exercisesMade.length + 1,
            weight: weightNumber,
            restTime: '/'
        };

        this.exercisesMade.push(exerciseMade);

        const history: History = {
            workout: this.workout,
            exercise: this.currentExercise,
            weight: weightNumber
        };

        this.historyService.create(history)
            .subscribe({
                error: (err) => {
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Impossible d\'enregister l\'historique'
                    });
                }
            });
    }

    toggleTimer() {
        if (this.weight < 0 || this.weight >= 500) {
            return;
        }

        if (this.timer.interval !== null) {
            this.stopTimer();
        } else {
            this.startTimer();
        }
    }

    switchPanel(exercise: Exercise, switchPanel?: () => void) {
        if (switchPanel) {
            switchPanel();
        }

        this.currentExercise = exercise;
        this.fillInputWeightLastSavedValue();
        this.exercisesMade = [];
        this.stopTimer();
    }


    convertWeightToElastics(): void {
        // Check if the weight is a multiple of 5, since all elastics come in 5kg steps
        if (this.weight % 5 !== 0) {
            return null;
        }

        // Recursive backtracking function to find the optimal combination
        const backtrack = (
            remaining: number,            // Weight left to reach
            index: number,                // Current index in the elastics list
            current: Elastic[],            // Current combination of elastic colors
            available: number[],          // How many of each elastic is still available
            best: { result: Elastic[] }    // Best (shortest) combination found so far
        ) => {
            // If we've reached the exact target weight
            if (remaining === 0) {
                // If it's the first result OR it's better (fewer elastics), save it
                if (
                    best.result.length === 0 ||
                    current.length < best.result.length
                ) {
                    best.result = [...current]; // Save a copy of the current combo
                }
                return;
            }

            // If we've tried all elastics, stop recursion
            if (index >= elastics.length) {
                return;
            }

            const currentElastic = elastics[index];


            // Try using 0 up to available[index] units of the current elastic
            for (let i = 0; i <= available[index]; i++) {
                const newRemaining = remaining - i * currentElastic.weight;

                // If weight goes below 0, no need to continue this path
                if (newRemaining < 0) {
                    break;
                }

                // Add i elastics of this type to the current combination
                for (let j = 0; j < i; j++) {
                    current.push({ ...currentElastic });
                }

                // Move to the next elastic type
                backtrack(newRemaining, index + 1, current, available, best);

                // Backtrack: remove the i elastics just added
                for (let j = 0; j < i; j++) {
                    current.pop();
                }
            }
        };

        // Create the availability array from your elastics config
        const available = elastics.map(e => e.count);

        // Holder for the best solution (fewest elastics)
        const best = { result: [] as Elastic[] };

        // Start recursive search
        backtrack(this.weight, 0, [], available, best);

        // Remove duplicate color and add "2x" to the name
        const bestCombinaison = best.result;
        bestCombinaison.forEach((elastic, index) => {
            const duplicateIndex = bestCombinaison.findIndex((e, i) => e.name === elastic.name && i !== index);

            if (duplicateIndex !== -1) {
                // Group same elastics
                bestCombinaison[index].name = `2x ${ elastic.name }`;

                // Remove other color
                bestCombinaison.splice(duplicateIndex, 1);
            }
        });

        // Return the best combination found
        this.weightToElastics = bestCombinaison;
    }

    private findExercises() {
        this.exerciseService.findAddedExercisesByMuscleGroupId(this.muscleGroupId)
            .pipe(
                take(1),
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
                    this.currentExercise = this.exercises[0];
                    this.fillInputWeightLastSavedValue();
                    this.alertService.alert$.next(null);
                },
                error: (err) => {
                    this.isLoading = false;

                    if (err?.error?.errorCode === ErrorCode.muscleGroupDoesntExist) {
                        this.router.navigate(['/', 'workout']);
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
            this.activeStep++;
            const nextExercise = this.exercises[this.activeStep - 1];
            this.switchPanel(nextExercise);
        }
    }

    private previousStep() {
        if (this.activeStep > 1) {
            this.activeStep--;
            const previousExercise = this.exercises[this.activeStep - 1];
            this.switchPanel(previousExercise);
        }
    }


    private fillInputWeightLastSavedValue() {
        this.historyService.findLastHistoryWeightByExerciseId(this.currentExercise.id)
            .pipe(take(1))
            .subscribe(history => {
                if (history) {
                    this.weight = history?.weight;
                    this.convertWeightToElastics();
                } else {
                    this.weight = null;
                }
            });
    }

    private startTimer() {
        if (!this.workout) {
            this.createWorkout(this.muscleGroupId)
                .pipe(take(1))
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

    private checkDuplicateWorkout() {
        this.workoutService.checkDuplicateWorkout(this.muscleGroupId)
            .pipe(take(1))
            .subscribe(workout => {
                if (workout) {
                    this.showDialogConfirmDuplicateWorkout();
                }
            });
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
            reject: () => {
                this.router.navigate(['/', 'workout']);
            }
        });
    }

    private showDialogConfirmDuplicateWorkout() {
        this.confirmationService.confirm({
            header: 'Attention',
            message: 'Vous avez déjà réalisé cette séance aujourd’hui.<br/>Souhaitez-vous la poursuivre ?',
            closable: true,
            closeOnEscape: true,
            dismissableMask: true,
            icon: 'pi pi-exclamation-triangle',
            acceptButtonProps: {
                label: 'Confirmer'
            },
            rejectButtonProps: {
                label: 'Annuler',
                severity: 'secondary',
                outlined: true
            },
            accept: () => this.findExercises(),
            reject: () => this.router.navigate(['/', 'workout'])
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
}

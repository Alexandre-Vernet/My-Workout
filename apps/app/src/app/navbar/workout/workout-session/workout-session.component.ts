import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, switchMap, take } from 'rxjs';
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
import { Message } from 'primeng/message';
import { HistoryService } from '../../../services/history.service';
import { History } from '../../../../../../../libs/interfaces/history';
import Hammer from 'hammerjs';
import { Skeleton } from 'primeng/skeleton';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { ExercisesTableComponent } from './exercises-table/exercises-table.component';
import { Elastic, elastics } from '../../../../../../../libs/interfaces/elastic';
import { Popover } from 'primeng/popover';

@Component({
    selector: 'app-workout-session',
    imports: [CommonModule, Stepper, StepList, Step, StepPanels, StepPanel, FormsModule, InputNumber, TableModule, ConfirmDialog, FaIconComponent, Message, Skeleton, ButtonDirective, Ripple, ExercisesTableComponent, Popover],
    templateUrl: './workout-session.component.html',
    styleUrl: './workout-session.component.scss',
    standalone: true,
    providers: [ConfirmationService],
    encapsulation: ViewEncapsulation.None

})
export class WorkoutSessionComponent implements OnInit {

    exercises: Exercise[] = [];
    exercisesMade: Exercise[] = [];
    currentExercise: Exercise;

    activeStep: number = 1;

    @ViewChild('swipeZone', { static: true }) swipeZone!: ElementRef<HTMLDivElement>;
    weight: number = 0;

    timer = {
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

    errorMessage: string;

    isLoading = true;

    isDarkMode = localStorage.getItem('dark-mode') === 'true';

    weightToElastics: Elastic[] = [];

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly exerciseService: ExerciseService,
        private readonly historyService: HistoryService,
        private readonly confirmationService: ConfirmationService,
        private readonly router: Router
    ) {
    }

    ngOnInit() {
        this.activatedRoute.params
            .pipe(
                take(1),
                map((params: { muscleGroupId: number }) => params.muscleGroupId),
                switchMap((muscleGroupId) => this.exerciseService.findExercisesByMuscleGroupIdAndUserId(muscleGroupId)
                    .pipe(map(exercises => ({ exercises, muscleGroupId })))
                )
            )
            .subscribe({
                next: ({ exercises, muscleGroupId }) => {
                    this.isLoading = false;
                    this.exercises = exercises;

                    if (exercises.length === 0) {
                        this.confirmationService.confirm({
                            target: event.target as EventTarget,
                            header: 'Attention',
                            message: `Vous n'avez ajouté aucun exercice à votre bibliothèque.<br/>Commencez par en ajouter pour pouvoir lancer un entraînement.`,
                            closable: false,
                            closeOnEscape: true,
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
                    } else {
                        this.currentExercise = this.exercises[0];
                        this.fillInputWeightLastSavedValue();
                    }
                },
                error: (err) => this.errorMessage = err?.error?.message ?? 'Impossible d\'afficher les exercices'
            });

        const hammer = new Hammer(this.swipeZone.nativeElement);

        hammer.on('swipeleft', () => this.nextStep());
        hammer.on('swiperight', () => this.previousStep());
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
            exercise: this.currentExercise,
            weight: weightNumber,
            createdAt: new Date()
        };

        this.historyService.create(history)
            .subscribe({
                error: (err) => this.errorMessage = err?.error?.message ?? 'Impossible d\'enregister l\'historique'
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
        this.saveExercise();

        this.timer.interval = setInterval(() => {

            this.timer.centiseconds++;

            if (this.timer.centiseconds === 100) {
                this.timer.seconds++;
                this.timer.centiseconds = 0;
            }

            if (this.timer.seconds === 60) {
                this.timer.minutes++;
                this.timer.seconds = 0;
            }
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
}

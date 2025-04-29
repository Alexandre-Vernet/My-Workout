import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

@Component({
    selector: 'app-workout-session',
    imports: [CommonModule, Stepper, StepList, Step, StepPanels, StepPanel, FormsModule, InputNumber, TableModule, ConfirmDialog, FaIconComponent, Message, Skeleton],
    templateUrl: './workout-session.component.html',
    styleUrl: './workout-session.component.scss',
    standalone: true,
    providers: [ConfirmationService]

})
export class WorkoutSessionComponent implements OnInit, AfterViewInit {

    exercises: Exercise[] = [];
    exercisesMade: Exercise[] = [];
    currentExercise: Exercise;

    activeStep: number = 1;

    @ViewChild('swipeZone', { static: true }) swipeZone!: ElementRef<HTMLDivElement>;
    @ViewChild('inputNumber', { read: ElementRef }) inputNumberRef!: ElementRef;
    weight: number = null;

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


    ngAfterViewInit() {
        // Disable focus input on click button increment / decrement weight
        if (this.inputNumberRef) {
            const el = this.inputNumberRef.nativeElement;
            const incrementBtn = el.querySelector('.p-inputnumber-button-up');
            const decrementBtn = el.querySelector('.p-inputnumber-button-down');

            if (incrementBtn && decrementBtn) {
                incrementBtn.addEventListener('mousedown', e => e.preventDefault());
                decrementBtn.addEventListener('mousedown', e => e.preventDefault());
            }
        }
    }


    saveExercise() {
        const exerciseMade: Exercise = {
            id: this.exercisesMade.length + 1,
            weight: this.weight,
            restTime: '/'
        };

        this.exercisesMade.push(exerciseMade);

        const history: History = {
            exercise: this.currentExercise,
            weight: this.weight,
            createdAt: new Date()
        };

        this.historyService.create(history).subscribe({
            error: (err) => this.errorMessage = err?.error?.message ?? 'Impossible d\'enregister l\'historique'
        });
    }

    toggleTimer() {
        if (!this.weight) {
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
            .subscribe(history => this.weight = history?.weight);
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

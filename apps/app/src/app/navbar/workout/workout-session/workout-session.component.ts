import { Component, OnInit } from '@angular/core';
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

@Component({
    selector: 'app-workout-session',
    imports: [CommonModule, Stepper, StepList, Step, StepPanels, StepPanel, FormsModule, InputNumber, TableModule, ConfirmDialog, FaIconComponent, Message],
    templateUrl: './workout-session.component.html',
    styleUrl: './workout-session.component.scss',
    standalone: true,
    providers: [ConfirmationService]

})
export class WorkoutSessionComponent implements OnInit {

    exercises: Exercise[] = [];
    exercisesMade: Exercise[] = [];

    activeStep: number = 1;

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

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly exerciseService: ExerciseService,
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
                    }
                },
                error: (err) => this.errorMessage = err?.error?.message ?? 'Impossible d\'afficher les exercices'
            });
    }

    saveExercise() {
        const exercise: Exercise = {
            id: this.exercisesMade.length + 1,
            weight: this.weight,
            restTime: '/'
        };

        this.exercisesMade.push(exercise);
    }

    clearExercisesMade() {
        this.exercisesMade = [];
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

    switchPanel(switchPanel: () => void) {
        switchPanel();
        this.clearExercisesMade();
        this.stopTimer();
        this.weight = null;
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

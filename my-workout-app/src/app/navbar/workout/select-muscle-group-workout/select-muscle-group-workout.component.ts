import { Component, OnInit } from '@angular/core';
import { MuscleGroupService } from '../../../services/muscle-group.service';
import { Router } from '@angular/router';
import { MenuUrls } from '../../../shared/menu-urls';
import { Tag } from 'primeng/tag';
import { Skeleton } from 'primeng/skeleton';
import {
    DialogSelectCardioExerciseComponent
} from '../dialog-select-cardio-exercise/dialog-select-cardio-exercise.component';
import { Alert } from '../../../../interfaces/alert';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { AlertService } from '../../../services/alert.service';
import { MuscleGroupExerciseCount } from '../../../../interfaces/MuscleGroupExerciseCount';
import { FirstLetterUppercasePipe } from '../../../shared/pipes/first-letter-uppercase.pipe';
import { MuscleGroupEnum } from '../../../../interfaces/MuscleGroupEnum';
import { MuscleGroup } from '../../../../interfaces/MuscleGroup';
import { ExerciseService } from "../../../services/exercise.service";
import { Exercise } from "../../../../interfaces/Exercise";
import { forkJoin } from "rxjs";

@Component({
    selector: 'select-muscle-group-workout',
    imports: [Tag, Skeleton, DialogSelectCardioExerciseComponent, ConfirmDialog, FirstLetterUppercasePipe],
    templateUrl: './select-muscle-group-workout.component.html',
    styleUrl: './select-muscle-group-workout.component.scss',
    standalone: true,
    providers: [ConfirmationService]
})
export class SelectMuscleGroupWorkoutComponent implements OnInit {

    muscleGroupExerciseCount: MuscleGroupExerciseCount[] = [];
    cardioExercises: Exercise[];

    isOpenModalExerciseCardio = false;

    constructor(
        private readonly muscleGroupService: MuscleGroupService,
        private readonly exerciseService: ExerciseService,
        private readonly alertService: AlertService,
        private readonly confirmationService: ConfirmationService,
        private readonly router: Router
    ) {
    }

    ngOnInit() {
        forkJoin([
            this.muscleGroupService.findAllRecommendedMuscleGroup(),
            this.exerciseService.findCardioExercises()
        ])
            .subscribe(([muscleGroupExerciseCount, cardioExercises]) => {
                this.muscleGroupExerciseCount = muscleGroupExerciseCount;
                this.cardioExercises = cardioExercises;
            });
    }

    openModalCardioExerciseChange() {
        this.isOpenModalExerciseCardio = false;
        this.muscleGroupService.findAllRecommendedMuscleGroup()
            .subscribe(muscleGroupExerciseCount => this.muscleGroupExerciseCount = muscleGroupExerciseCount);
    }

    protected clickMuscleGroup(muscleGroup: MuscleGroup) {
        if (muscleGroup.id === MuscleGroupEnum.CARDIO) {
            this.openModalExerciseCardio(muscleGroup);
        } else {
            this.router.navigate(['/', MenuUrls.workout, 'workout-session', muscleGroup.id]);
        }
    }


    protected showAlert(alert: Alert) {
        window.scrollTo(0, 0);
        this.alertService.alert$.next(alert);
    }

    private openModalExerciseCardio(muscleGroup: MuscleGroup) {
        // If user has no exercise cardio, show dialog to add these exercises
        const cardioExercise = this.muscleGroupExerciseCount.some(m => m.muscleGroup.id === MuscleGroupEnum.CARDIO);
        if (!cardioExercise) {
            this.showDialogNoExercisesAdded(muscleGroup);
            return;
        }

        this.isOpenModalExerciseCardio = true;
    }

    private showDialogNoExercisesAdded(muscleGroup: MuscleGroup) {
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
            accept: () => this.router.navigate(['/', 'library', 'list-exercises-muscle-group', muscleGroup.id]),
            reject: () => this.router.navigate(['/', 'workout'])
        });
    }
}

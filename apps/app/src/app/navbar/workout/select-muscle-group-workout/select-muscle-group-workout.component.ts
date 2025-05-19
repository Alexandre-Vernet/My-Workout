import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MuscleGroup } from '../../../../../../../libs/interfaces/MuscleGroup';
import { MuscleGroupService } from '../../../services/muscle-group.service';
import { RouterLink } from '@angular/router';
import { MenuUrls } from '../../../shared/menu-urls';
import { forkJoin, take } from 'rxjs';
import { Message } from 'primeng/message';
import { Tag } from 'primeng/tag';
import { Skeleton } from 'primeng/skeleton';
import { ThemeService } from '../../../theme/theme.service';
import {
    DialogSelectCardioExerciseComponent
} from '../dialog-select-cardio-exercise/dialog-select-cardio-exercise.component';

@Component({
    selector: 'select-muscle-group-workout',
    imports: [CommonModule, RouterLink, Message, Tag, Skeleton, DialogSelectCardioExerciseComponent],
    templateUrl: './select-muscle-group-workout.component.html',
    styleUrl: './select-muscle-group-workout.component.scss',
    standalone: true
})
export class SelectMuscleGroupWorkoutComponent implements OnInit {

    protected readonly MenuUrls = MenuUrls;

    muscleGroups: MuscleGroup[] = [];

    openModalExerciseCardio = false;

    errorMessage: string;

    isLoading = true;

    isDarkMode = false;

    constructor(
        private readonly muscleGroupService: MuscleGroupService,
        private readonly themeService: ThemeService
    ) {
    }

    ngOnInit() {
        forkJoin([
            this.muscleGroupService.findAllMuscleGroupAndCountExercisesByUserId(),
            this.muscleGroupService.suggestMuscleGroup()
        ])
            .pipe(take(1))
            .subscribe({
                next: ([muscleGroups, recommendedWorkout]) => {
                    this.isLoading = false;
                    this.errorMessage = '';
                    this.muscleGroups = muscleGroups;

                    if (recommendedWorkout) {
                        const muscleGroupRecommended = this.muscleGroups.find(m => m.id === recommendedWorkout.id);
                        muscleGroupRecommended.isRecommended = true;
                        this.muscleGroups.sort(m => m.isRecommended ? -1 : 1);
                    }
                },
                error: (err) => this.errorMessage = err?.error?.message ?? 'Impossible d\'afficher les entraînements'
            });

        this.isDarkMode = this.themeService.isDarkMode();
    }

    closeModalExerciseCardio() {
        this.openModalExerciseCardio = false;
    }
}

import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { UserExercisesCountTotalWorkout } from '../../../interfaces/UserExercisesCountTotalWorkout';
import { HistoryService } from '../../services/history.service';
import { Exercise } from '../../../interfaces/Exercise';
import { CustomError } from '../../../interfaces/CustomError';
import { getErrorMessage } from '../../shared/utils/http-error';
import { getMuscleGroupColor, getMuscleGroupLabel } from '../../shared/utils/muscle-group-color';

interface ExerciseGroup {
    readonly label: string;
    readonly color: string;
    readonly exercises: readonly Exercise[];
}

@Component({
    selector: 'app-stats',
    imports: [RouterLink],
    templateUrl: './stats.component.html',
    styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit {

    userExercisesCountTotalWorkout!: UserExercisesCountTotalWorkout;

    private readonly historyService = inject(HistoryService);
    private readonly alertService = inject(AlertService);

    ngOnInit() {
        this.historyService.getGlobalStatsWithListExercises()
            .subscribe({
                next: (userExercisesCountTotalWorkout) => this.userExercisesCountTotalWorkout = userExercisesCountTotalWorkout,
                error: (err: CustomError) => {
                    this.alertService.show({
                        severity: 'error',
                        message: getErrorMessage(err, 'Erreur lors de la récupération des statistiques')
                    });
                }
            });
    }

    protected get groupedExercises(): ExerciseGroup[] {
        const exercisesByGroupName = new Map<string, Exercise[]>();

        for (const exercise of this.userExercisesCountTotalWorkout.exercises) {
            const muscleGroupName = exercise.muscles?.[0]?.muscleGroup?.name ?? '';
            const exercisesInGroup = exercisesByGroupName.get(muscleGroupName) ?? [];
            exercisesInGroup.push(exercise);
            exercisesByGroupName.set(muscleGroupName, exercisesInGroup);
        }

        return [...exercisesByGroupName.entries()]
            .map(([muscleGroupName, exercisesInGroup]) => ({
                label: getMuscleGroupLabel(muscleGroupName),
                color: getMuscleGroupColor(muscleGroupName),
                exercises: exercisesInGroup
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }
}

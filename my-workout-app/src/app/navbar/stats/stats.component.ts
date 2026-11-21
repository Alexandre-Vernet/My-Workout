import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { AlertService } from '../../services/alert.service';
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
    styleUrl: './stats.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsComponent {

    private readonly historyService = inject(HistoryService);
    private readonly alertService = inject(AlertService);

    protected readonly userExercisesCountTotalWorkout = toSignal(
        this.historyService.getGlobalStatsWithListExercises().pipe(
            catchError((err: CustomError) => {
                this.alertService.show({
                    severity: 'error',
                    message: getErrorMessage(err, 'Erreur lors de la récupération des statistiques')
                });
                return EMPTY;
            })
        )
    );

    protected readonly groupedExercises = computed<ExerciseGroup[]>(() => {
        const exercisesByGroupName = new Map<string, Exercise[]>();

        for (const exercise of this.userExercisesCountTotalWorkout()!.exercises) {
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
    });
}

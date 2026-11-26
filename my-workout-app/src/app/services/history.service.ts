import { Service, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { History } from '../../interfaces/History';
import { HttpClient } from '@angular/common/http';
import { ExerciseGraphs } from '../../interfaces/ExerciseGraphs';
import { UserExercisesCountTotalWorkout } from '../../interfaces/UserExercisesCountTotalWorkout';

@Service()
export class HistoryService {
    private readonly http = inject(HttpClient);


    historyUrl = environment.historyUrl();

    findLastHistoryWeightByExerciseId(exerciseId: number, gymId?: number) {
        return this.http.get<History>(`${ this.historyUrl }/last/${ exerciseId }`, {
            params: gymId !== undefined ? { gymId } : {}
        });
    }

    findTodayExercicesHistory(muscleGroupId: number, exerciseId: number, gymId?: number) {
        return this.http.get<History[]>(`${ this.historyUrl }/today/${ muscleGroupId }/${ exerciseId }`, {
            params: gymId !== undefined ? { gymId } : {}
        });
    }


    getGlobalStatsWithListExercises() {
        return this.http.get<UserExercisesCountTotalWorkout>(`${ this.historyUrl }/stats`);
    }

    getExerciseGraphs(exerciseId: number, gymId?: number) {
        return this.http.get<ExerciseGraphs>(`${ this.historyUrl }/exercise-graph/${ exerciseId }`, {
            params: gymId !== undefined ? { gymId } : {}
        });
    }

    update(history: History) {
        return this.http.patch<History>(`${ this.historyUrl }/${ history.id }`, history);
    }

    delete(history: History) {
        return this.http.delete<History>(`${ this.historyUrl }/${ history.id }`);
    }
}

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { History } from '../../interfaces/History';
import { HttpClient } from '@angular/common/http';
import { ExerciseGraphs } from '../../interfaces/ExerciseGraphs';
import { UserExercisesCountTotalWorkout } from '../../interfaces/UserExercisesCountTotalWorkout';

@Injectable({
    providedIn: 'root'
})
export class HistoryService {

    historyUrl = environment.historyUrl();

    constructor(
        private readonly http: HttpClient
    ) {
    }

    findLastHistoryWeightByExerciseId(exerciseId: number) {
        return this.http.get<History>(`${ this.historyUrl }/last/${ exerciseId }`);
    }

    findTodayExercicesHistory(muscleGroupId: number, exerciseId: number) {
        return this.http.get<History[]>(`${ this.historyUrl }/today/${ muscleGroupId }/${ exerciseId }`);
    }


    getGlobalStatsWithListExercises() {
        return this.http.get<UserExercisesCountTotalWorkout>(`${ this.historyUrl }/stats`);
    }

    getExerciseGraphs(exerciseId: number) {
        return this.http.get<ExerciseGraphs>(`${ this.historyUrl }/exercise-graph/${ exerciseId }`);
    }

    update(history: History) {
        return this.http.patch<History>(`${ this.historyUrl }/${ history.id }`, history);
    }

    delete(history: History) {
        return this.http.delete<History>(`${ this.historyUrl }/${ history.id }`);
    }
}

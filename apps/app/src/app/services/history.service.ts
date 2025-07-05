import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { History } from '../../../../../libs/interfaces/history';
import { HttpClient } from '@angular/common/http';
import { Workout } from '../../../../../libs/interfaces/workout';

@Injectable({
    providedIn: 'root'
})
export class HistoryService {

    historyUrl = environment.historyUrl();

    constructor(
        private readonly http: HttpClient
    ) {
    }

    create(history: History) {
        return this.http.post<History>(this.historyUrl, history);
    }

    find() {
        return this.http.get<Workout[]>(this.historyUrl);
    }

    findLastHistoryWeightByExerciseId(exerciseId: number) {
        return this.http.get<History>(`${ this.historyUrl }/last`, {
            params: {
                exerciseId
            }
        });
    }

    findTodayExercicesHistory(muscleGroupId: number, exerciseId: number) {
        return this.http.get<History[]>(`${ this.historyUrl }/today`, {
            params: {
                muscleGroupId,
                exerciseId
            }
        });
    }

    update(history: History) {
        return this.http.put<History>(`${ this.historyUrl }/${ history.id }`, history);
    }

    delete(history: History) {
        return this.http.delete<History>(`${ this.historyUrl }/${ history.id }`);
    }
}

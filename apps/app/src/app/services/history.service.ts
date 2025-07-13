import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { History } from '../../../../../libs/interfaces/history';
import { HttpClient } from '@angular/common/http';

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
        return this.http.get<History[]>(this.historyUrl);
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

    graphs(exerciseId: number) {
        return this.http.get<History[]>(`${ this.historyUrl }/graphs`, {
            params: {
                exerciseId
            }
        });
    }

    countTotalWeight(exerciseId: number) {
        return this.http.get<number>(`${ this.historyUrl }/count-total-weight`, {
            params: {
                exerciseId
            }
        });
    }

    countTotalReps(exerciseId: number) {
        return this.http.get<number>(`${ this.historyUrl }/count-total-reps`, {
            params: {
                exerciseId
            }
        });
    }

    countMaxWeight(exerciseId: number) {
        return this.http.get<number>(`${ this.historyUrl }/count-max-weight`, {
            params: {
                exerciseId
            }
        });
    }
}

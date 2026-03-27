import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { History } from '../../interfaces/history';
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

    findLastHistoryWeightByExerciseId(exerciseId: number) {
        return this.http.get<History>(`${ this.historyUrl }/last/${ exerciseId }`);
    }

    findTodayExercicesHistory(muscleGroupId: number, exerciseId: number) {
        return this.http.get<History[]>(`${ this.historyUrl }/today/${ muscleGroupId }/${ exerciseId }`);
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

    update(history: History) {
        return this.http.patch<History>(`${ this.historyUrl }/${ history.id }`, history);
    }

    delete(history: History) {
        return this.http.delete<History>(`${ this.historyUrl }/${ history.id }`);
    }

    deleteIds(id: number[]) {
        return this.http.delete<void>(`${ this.historyUrl }/delete-ids`, {
            body: {
                id
            }
        });
    }
}

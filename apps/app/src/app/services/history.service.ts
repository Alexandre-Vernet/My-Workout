import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { History } from '../../../../../libs/interfaces/history';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { switchMap, take } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HistoryService {

    historyUrl = environment.historyUrl();

    constructor(
        private readonly http: HttpClient,
        private readonly authService: AuthService
    ) {
    }

    create(history: History) {
        return this.authService.user$
            .pipe(
                take(1),
                switchMap(user => {
                    history.user = user;
                    return this.http.post<History>(this.historyUrl, history);
                })
            );
    }

    findLastHistoryWeightByExerciseId(exerciseId: number) {
        return this.authService.user$
            .pipe(
                take(1),
                switchMap(user => {
                    return this.http.get<History>(`${ this.historyUrl }/${ user.id }/${ exerciseId }`);
                })
            );
    }
}

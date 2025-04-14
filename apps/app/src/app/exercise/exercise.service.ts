import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Exercise } from '../../../../../libs/interfaces/exercise';
import { AuthService } from '../auth/auth.service';
import { switchMap, take } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ExerciseService {

    exerciseUrl = environment.exerciseUrl();

    constructor(
        private readonly httpClient: HttpClient,
        private readonly authService: AuthService) {
    }

    listExercise(muscleGroupId: number) {
        return this.authService.user$
            .pipe(
                take(1),
                switchMap(user => this.httpClient.post<Exercise[]>(this.exerciseUrl, { userId: user.id, muscleGroupId }))
            );
    }
}

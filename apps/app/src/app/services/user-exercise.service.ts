import { Injectable } from '@angular/core';
import { Exercise } from '../../../../../libs/interfaces/exercise';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserExercise } from '../../../../../libs/interfaces/user-exercise';
import { AuthService } from '../auth/auth.service';
import { map, switchMap, take } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserExerciseService {

    userExerciseUrl = environment.userExerciseUrl();

    constructor(
        private readonly http: HttpClient,
        private readonly authService: AuthService
    ) {
    }

    toggleExerciseWorkout(exercise: Exercise) {
        return this.authService.user$
            .pipe(
                take(1),
                map(user => {
                    const userExercise: UserExercise = {
                        user,
                        exercise,
                    }

                    return userExercise;
                }),
                switchMap(workout => this.http.post<UserExercise>(this.userExerciseUrl, workout))
            );
    }
}

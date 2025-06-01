import { Injectable } from '@angular/core';
import { Exercise } from '../../../../../libs/interfaces/exercise';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserExercise } from '../../../../../libs/interfaces/user-exercise';

@Injectable({
    providedIn: 'root'
})
export class UserExerciseService {

    userExerciseUrl = environment.userExerciseUrl();

    constructor(
        private readonly http: HttpClient
    ) {
    }

    toggleExerciseWorkout(exercise: Exercise) {
        const userExercise: UserExercise = {
            exercise
        };

        return this.http.post<UserExercise>(this.userExerciseUrl, userExercise);
    }

    updateOrderExercises(userExercises: UserExercise[]) {
        return this.http.put<UserExercise>(this.userExerciseUrl, userExercises);
    }
}

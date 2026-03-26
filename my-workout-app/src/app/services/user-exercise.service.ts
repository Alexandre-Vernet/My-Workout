import { Injectable } from '@angular/core';
import { Exercise } from '../../interfaces/exercise';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserExercise } from '../../interfaces/user-exercise';

@Injectable({
    providedIn: 'root'
})
export class UserExerciseService {

    userExerciseUrl = environment.userExerciseUrl();

    constructor(
        private readonly http: HttpClient
    ) {
    }

    findAddedExercisesByMuscleGroupId(muscleGroupId: number) {
        return this.http.get<UserExercise[]>(`${ this.userExerciseUrl }/find-added-exercises-by-muscle-group-id/${ muscleGroupId }`);
    }

    toggleExerciseWorkout(exercise: Exercise) {
        const userExercise: UserExercise = {
            exercise
        };

        return this.http.post<UserExercise>(this.userExerciseUrl, userExercise);
    }

    updateOrderExercises(userExercises: UserExercise[]) {
        return this.http.patch<void>(this.userExerciseUrl, userExercises);
    }
}

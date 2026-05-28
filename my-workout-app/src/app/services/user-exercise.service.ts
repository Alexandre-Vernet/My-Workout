import { Injectable } from '@angular/core';
import { Exercise } from '../../interfaces/Exercise';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserExercise } from '../../interfaces/User-exercise';

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
        return this.http.get<UserExercise[]>(`${ this.userExerciseUrl }/added/${ muscleGroupId }`);
    }

    toggleExerciseWorkout(exercise: Exercise) {
        return this.http.post<UserExercise>(this.userExerciseUrl, exercise);
    }

    updateOrderExercises(userExercises: UserExercise[]) {
        return this.http.patch<void>(this.userExerciseUrl, userExercises);
    }


}

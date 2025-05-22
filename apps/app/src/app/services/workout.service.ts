import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Workout } from '../../../../../libs/interfaces/workout';

@Injectable({
    providedIn: 'root'
})
export class WorkoutService {

    workoutUrl = environment.workoutUrl();

    constructor(
        private readonly http: HttpClient
    ) {
    }

    create(workout: Workout) {
        return this.http.post<Workout>(this.workoutUrl, workout);
    }

    findById(id: number) {
        return this.http.get<Workout>(`${ this.workoutUrl }/${ id }`);
    }

    findAll() {
        return this.http.get<Workout[]>(this.workoutUrl);
    }

    checkDuplicateWorkout(muscleGroupId: number) {
        return this.http.get<Workout[]>(`${ this.workoutUrl }/duplicate-workout`, {
            params: {
                muscleGroupId
            }
        });
    }

    delete(id: number) {
        return this.http.delete<void>(`${ this.workoutUrl }`, {
            params: {
                id
            }
        });
    }
}

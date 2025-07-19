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

    find() {
        return this.http.get<Workout[]>(this.workoutUrl);
    }

    findByDate(start: Date, end: Date) {
        return this.http.get<Workout[]>(`${ this.workoutUrl }/find-by-date`, {
            params: {
                start: start.toISOString(),
                end: end.toISOString()
            }
        });
    }

    checkDuplicateWorkout(muscleGroupId: number) {
        return this.http.get<Workout[]>(`${ this.workoutUrl }/duplicate-workout`, {
            params: {
                muscleGroupId
            }
        });
    }

    countTotalDaysWorkout() {
        return this.http.get<number>(`${ this.workoutUrl }/count-total-days-workout`);
    }

    delete(id: number) {
        return this.http.delete<void>(`${ this.workoutUrl }`, {
            params: {
                id
            }
        });
    }
}

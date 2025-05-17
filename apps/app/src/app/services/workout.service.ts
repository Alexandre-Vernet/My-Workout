import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { switchMap } from 'rxjs';
import { Workout } from '../../../../../libs/interfaces/workout';

@Injectable({
    providedIn: 'root'
})
export class WorkoutService {

    workoutUrl = environment.workoutUrl();

    constructor(
        private readonly http: HttpClient,
        private readonly authService: AuthService
    ) {
    }

    create(workout: Workout, forceCreateWorkout = false) {
        return this.authService.user$
            .pipe(
                switchMap(user => {
                    workout.user = user;
                    return this.http.post<Workout>(this.workoutUrl, { workout, forceCreateWorkout });
                })
            );
    }

    findById(id: number) {
        return this.http.get<Workout>(`${ this.workoutUrl }/${ id }`);
    }

    findByUserId() {
        return this.authService.user$
            .pipe(
                switchMap(user => this.http.get<Workout[]>(this.workoutUrl, {
                    params: {
                        userId: user.id
                    }
                }))
            );
    }

    delete(id: number) {
        return this.authService.user$
            .pipe(
                switchMap(user => this.http.delete<{ deletedId: number }>(`${ this.workoutUrl }`, {
                    params: {
                        id,
                        userId: user.id
                    }
                }))
            );
    }
}

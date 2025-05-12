import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { switchMap, take } from 'rxjs';
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

    getWorkoutFromUserId() {
        return this.authService.user$
            .pipe(
                switchMap(user => this.http.get<Workout[]>(`${ this.workoutUrl }/${ user.id }`))
            );
    }

    delete(id: number) {
        return this.authService.user$
            .pipe(
                take(1),
                switchMap(user => {
                    return this.http.delete<{ deletedId: number }>(`${ this.workoutUrl }/${ user.id }`, { body: { id } });
                })
            );
    }
}

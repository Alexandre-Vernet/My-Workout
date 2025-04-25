import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Exercise } from '../../../../../libs/interfaces/exercise';
import { AuthService } from '../auth/auth.service';
import { switchMap, take } from 'rxjs';
import { MuscleGroup } from '../../../../../libs/interfaces/MuscleGroup';

@Injectable({
    providedIn: 'root'
})
export class ExerciseService {

    exerciseUrl = environment.exerciseUrl();

    constructor(
        private readonly httpClient: HttpClient,
        private readonly authService: AuthService) {
    }

    findAllExercisesByMuscleGroupIdAndUserId(muscleGroupId: number) {
        return this.authService.user$
            .pipe(
                take(1),
                switchMap(user => this.httpClient.post<{
                    exercises: Exercise[],
                    muscleGroup: MuscleGroup
                }>(`${ this.exerciseUrl }/find-all-exercises-by-muscle-group-id-and-user-id`, {
                    userId: user.id,
                    muscleGroupId
                }))
            );
    }

    findExercisesByMuscleGroupIdAndUserId(muscleGroupId: number) {
        return this.authService.user$
            .pipe(
                take(1),
                switchMap(user => this.httpClient.post<Exercise[]>(`${ this.exerciseUrl }/find-exercises-by-muscle-group-id-and-user-id`, {
                    userId: user.id,
                    muscleGroupId
                }))
            );
    }
}

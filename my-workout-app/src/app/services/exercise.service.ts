import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Exercise } from '../../interfaces/Exercise';
import { MuscleGroupExercises } from '../../interfaces/MuscleGroupExercises';
import { ExerciseMuscle } from '../../interfaces/ExerciseMuscle';
import { AuthService } from "../auth/auth.service";
import { catchError, switchMap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ExerciseService {

    exerciseUrl = environment.exerciseUrl();

    constructor(
        private readonly http: HttpClient,
        private readonly authService: AuthService,
    ) {
    }

    findAllExercises(muscleGroupId: number) {
        return this.authService.getCurrentUser()
            .pipe(
                switchMap(() => this.findAllExercisesByUserAndMuscleGroupId(muscleGroupId)),
                catchError(() => this.findAllExercisesByMuscleGroupId(muscleGroupId))
            )
    }

    findCardioExercises() {
        return this.http.get<Exercise[]>(`${ this.exerciseUrl }/cardio`);
    }

    findExerciseMuscle(exerciseId: number) {
        return this.http.get<ExerciseMuscle>(`${ this.exerciseUrl }/${ exerciseId }`);
    }

    createOrUpdateExercise(exerciseMuscle: ExerciseMuscle) {
        return this.http.post<Exercise>(`${ this.exerciseUrl }`, exerciseMuscle);
    }

    generateExerciseDescription(exerciseName: string) {
        return this.http.get<{ description: string }>(`${ this.exerciseUrl }/description`, {
            params: {
                exerciseName
            }
        });
    }


    private findAllExercisesByUserAndMuscleGroupId(muscleGroupId: number) {
        return this.http.get<MuscleGroupExercises>(`${ this.exerciseUrl }/find-all-exercises-by-user-muscle-group-id/${ muscleGroupId }`);
    }

    private findAllExercisesByMuscleGroupId(muscleGroupId: number) {
        return this.http.get<MuscleGroupExercises>(`${ this.exerciseUrl }/find-all-exercises-by-muscle-group-id/${ muscleGroupId }`);
    }
}

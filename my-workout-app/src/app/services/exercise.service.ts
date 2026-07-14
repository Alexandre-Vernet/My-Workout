import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Exercise } from '../../interfaces/Exercise';
import { ExerciseMuscle } from '../../interfaces/ExerciseMuscle';

@Injectable({
    providedIn: 'root'
})
export class ExerciseService {

    exerciseUrl = environment.exerciseUrl();

    constructor(
        private readonly http: HttpClient,
    ) {
    }

    findAll() {
        return this.http.get<Exercise[]>(`${ this.exerciseUrl }`);
    }

    search(value: string) {
        return this.http.get<Exercise[]>(`${ this.exerciseUrl }/search`, {
            params: {
                search: value
            }
        });
    }

    findExercisesByMuscleGroup(muscleGroupId: number) {
        return this.http.get<Exercise[]>(`${ this.exerciseUrl }/muscle-group/${ muscleGroupId }`);
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
}

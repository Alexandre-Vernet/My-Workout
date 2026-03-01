import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Exercise } from '../../interfaces/exercise';
import { MuscleGroup } from '../../interfaces/MuscleGroup';

@Injectable({
    providedIn: 'root'
})
export class ExerciseService {

    exerciseUrl = environment.exerciseUrl();

    constructor(private readonly http: HttpClient) {
    }

    findAllExercisesByMuscleGroupId(muscleGroupId: number) {
        return this.http.get<{
            exercises: Exercise[],
            muscleGroup: MuscleGroup
        }>(`${this.exerciseUrl}/find-all-exercises-by-muscle-group-id`, {
            params: {
                muscleGroupId
            }
        });
    }

    findAddedExercisesByMuscleGroupId(muscleGroupId: number) {
        return this.http.get<Exercise[]>(`${this.exerciseUrl}/find-added-exercises-by-muscle-group-id`, {
            params: {
                muscleGroupId
            }
        });
    }

    findCardioExercises() {
        return this.http.get<Exercise[]>(`${this.exerciseUrl}/find-cardio-exercises`);
    }

    getExercise(exerciseId: number) {
        return this.http.get<Exercise>(`${this.exerciseUrl}/${exerciseId}`);
    }

    findByUserId() {
        return this.http.get<Exercise[]>(`${this.exerciseUrl}/find-by-user-id`);
    }

    createExercise(exercise: Exercise) {
        return this.http.post<Exercise>(`${this.exerciseUrl}`, exercise);
    }

    updateExercise(exercise: Exercise) {
        return this.http.patch<Exercise>(`${this.exerciseUrl}/${exercise.id}`, exercise);
    }
}

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Exercise } from '../../interfaces/exercise';
import { MuscleGroupExercises } from '../../interfaces/MuscleGroupExercises';
import { ExerciseMuscle } from '../../interfaces/ExerciseMuscle';

@Injectable({
    providedIn: 'root'
})
export class ExerciseService {

    exerciseUrl = environment.exerciseUrl();

    constructor(private readonly http: HttpClient) {
    }

    findAllExercisesByMuscleGroupId(muscleGroupId: number) {
        return this.http.get<MuscleGroupExercises>(`${ this.exerciseUrl }/find-all-exercises-by-muscle-group-id/${ muscleGroupId }`);
    }

    findCardioExercises() {
        return this.http.get<Exercise[]>(`${ this.exerciseUrl }/find-cardio-exercises`);
    }

    findExerciseMuscle(exerciseId: number) {
        return this.http.get<ExerciseMuscle>(`${ this.exerciseUrl }/${ exerciseId }`);
    }

    findByUserId() {
        return this.http.get<Exercise[]>(`${ this.exerciseUrl }/find-by-user-id`);
    }

    createExercise(exercise: Exercise) {
        return this.http.post<Exercise>(`${ this.exerciseUrl }`, exercise);
    }

    updateExercise(exercise: Exercise) {
        return this.http.patch<Exercise>(`${ this.exerciseUrl }/${ exercise.id }`, exercise);
    }
}

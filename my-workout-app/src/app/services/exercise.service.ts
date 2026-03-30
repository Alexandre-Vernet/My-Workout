import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Exercise } from '../../interfaces/Exercise';
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

    createOrUpdateExercise(exerciseMuscle: ExerciseMuscle) {
        return this.http.post<Exercise>(`${ this.exerciseUrl }`, exerciseMuscle);
    }
}

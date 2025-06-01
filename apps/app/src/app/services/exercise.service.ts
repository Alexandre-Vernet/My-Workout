import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Exercise } from '../../../../../libs/interfaces/exercise';
import { MuscleGroup } from '../../../../../libs/interfaces/MuscleGroup';

@Injectable({
    providedIn: 'root'
})
export class ExerciseService {

    exerciseUrl = environment.exerciseUrl();

    constructor(
        private readonly httpClient: HttpClient) {
    }

    findAllExercisesByMuscleGroupId(muscleGroupId: number) {
        return this.httpClient.get<{
            exercises: Exercise[],
            muscleGroup: MuscleGroup
        }>(`${ this.exerciseUrl }/find-all-exercises-by-muscle-group-id`, {
            params: {
                muscleGroupId
            }
        });
    }

    findAddedExercisesByMuscleGroupId(muscleGroupId: number) {
        return this.httpClient.get<Exercise[]>(`${ this.exerciseUrl }/find-added-exercises-by-muscle-group-id`, {
            params: {
                muscleGroupId
            }
        });
    }


    findCardioExercises() {
        return this.httpClient.get<Exercise[]>(`${ this.exerciseUrl }/find-cardio-exercises`);
    }

    getExercise(exerciseId: number) {
        return this.httpClient.get<Exercise[]>(`${ this.exerciseUrl }/${ exerciseId }`);
    }
}

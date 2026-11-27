import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MuscleGroup } from '../../interfaces/MuscleGroup';
import { MuscleGroupExerciseCount } from '../../interfaces/MuscleGroupExerciseCount';

@Service()
export class MuscleGroupService {
    private readonly http = inject(HttpClient);


    muscleGroupUrl = environment.muscleGroupUrl();

    findAllMuscleGroup() {
        return this.http.get<MuscleGroup[]>(this.muscleGroupUrl);
    }

    findAllRecommendedMuscleGroup() {
        return this.http.get<MuscleGroupExerciseCount[]>(`${ this.muscleGroupUrl }/recommended`);
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MuscleGroup } from '../../interfaces/MuscleGroup';
import { MuscleGroupExerciseCount } from '../../interfaces/MuscleGroupExerciseCount';

@Injectable({
    providedIn: 'root'
})
export class MuscleGroupService {

    muscleGroupUrl = environment.muscleGroupUrl();

    constructor(
        private readonly http: HttpClient
    ) {
    }

    findAllMuscleGroup() {
        return this.http.get<MuscleGroup[]>(this.muscleGroupUrl);
    }

    findAllRecommendedMuscleGroup() {
        return this.http.get<MuscleGroupExerciseCount[]>(`${ this.muscleGroupUrl }/find-muscle-group-recommended`);
    }
}

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MuscleGroupExerciseCount } from '../../interfaces/MuscleGroupExerciseCount';

@Injectable({
    providedIn: 'root'
})
export class MuscleGroupService {

    muscleGroupUrl = environment.muscleGroupUrl();

    private readonly http = inject(HttpClient);

    findAllRecommendedMuscleGroup() {
        return this.http.get<MuscleGroupExerciseCount[]>(`${ this.muscleGroupUrl }/recommended`);
    }
}

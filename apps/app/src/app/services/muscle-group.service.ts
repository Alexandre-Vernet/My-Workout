import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MuscleGroup } from '../../../../../libs/interfaces/MuscleGroup';

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

    findAllMuscleGroupAndCountAddedExercises() {
        return this.http.get<MuscleGroup[]>(`${ this.muscleGroupUrl }/count-exercises`);
    }

    suggestMuscleGroup() {
        return this.http.get<MuscleGroup>(`${ this.muscleGroupUrl }/suggest-muscle-group`);
    }
}

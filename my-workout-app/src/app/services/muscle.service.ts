import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MuscleDropdown } from '../../interfaces/MuscleDropdown';

@Injectable({
  providedIn: 'root',
})
export class MuscleService {

    muscleUrl = environment.muscleUrl();

    constructor(
        private readonly http: HttpClient
    ) {
    }

    findAllMuscles() {
        return this.http.get<MuscleDropdown[]>(this.muscleUrl);
    }

}

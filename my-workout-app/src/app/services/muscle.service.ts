import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MuscleDropdown } from '../../interfaces/MuscleDropdown';

@Injectable({
  providedIn: 'root',
})
export class MuscleService {
    private readonly http = inject(HttpClient);


    muscleUrl = environment.muscleUrl();

    findAllMuscles() {
        return this.http.get<MuscleDropdown[]>(this.muscleUrl);
    }

}

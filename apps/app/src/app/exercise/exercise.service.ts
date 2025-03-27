import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  constructor(private readonly httpClient: HttpClient) {}

  listExercise(muscleGroupId: number) {
    return this.httpClient.get(
      `${environment.API_URL}/exercises?muscleGroup=${muscleGroupId}`
    );
  }
}

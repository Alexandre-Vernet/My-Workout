import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Exercise } from '../../../../../libs/interfaces/exercise';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  constructor(private readonly httpClient: HttpClient) {}

  listExercise(muscleGroupId: number) {
    return this.httpClient.get<Exercise[]>(
      `${environment.API_URL}/exercises?muscleGroup=${muscleGroupId}`
    );
  }
}

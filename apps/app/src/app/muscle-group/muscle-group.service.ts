import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MuscleGroup } from '../../../../../libs/interfaces/MuscleGroup';

@Injectable({
  providedIn: 'root',
})
export class MuscleGroupService {
  constructor(private readonly httpClient: HttpClient) {}

  findAllMuscleGroup() {
    return this.httpClient.get<MuscleGroup[]>(`${environment.API_URL}/muscle-group`);
  }
}

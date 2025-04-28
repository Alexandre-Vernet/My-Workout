import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MuscleGroup } from '../../../../../libs/interfaces/MuscleGroup';
import { switchMap, take } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class MuscleGroupService {

    muscleGroupUrl = environment.muscleGroupUrl();


    constructor(
        private readonly http: HttpClient,
        private readonly authService: AuthService
    ) {
    }

    findAllMuscleGroup() {
        return this.authService.user$
            .pipe(
                take(1),
                switchMap(user => this.http.get<MuscleGroup[]>(`${ this.muscleGroupUrl }/users/${ user.id }`))
            );
    }

    suggestMuscleGroup() {
        return this.authService.user$
            .pipe(
                take(1),
                switchMap(user => {
                    return this.http.get<MuscleGroup>(`${ this.muscleGroupUrl }/suggest-muscle-group/users/${ user.id }`);
                })
            );
    }
}

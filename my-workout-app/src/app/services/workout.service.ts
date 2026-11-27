import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Workout } from '../../interfaces/Workout';
import { toLocalDate } from '../shared/utils/date-utils';
import { WorkoutGroupedHistories } from '../../interfaces/WorkoutGroupedHistories';
import { History } from '../../interfaces/History';

@Service()
export class WorkoutService {
    private readonly http = inject(HttpClient);


    workoutUrl = environment.workoutUrl();

    create(workout: Workout, history: History) {
        return this.http.post<Workout>(this.workoutUrl, { workout, history });
    }

    findById(id: number) {
        return this.http.get<WorkoutGroupedHistories>(`${ this.workoutUrl }/${ id }`);
    }

    find() {
        return this.http.get<Workout[]>(this.workoutUrl);
    }

    findByDate(start: Date, end: Date) {
        return this.http.get<Workout[]>(`${ this.workoutUrl }/date`, {
            params: {
                start: toLocalDate(start),
                end: toLocalDate(end)
            }
        });
    }

    delete(id: number) {
        return this.http.delete<void>(`${ this.workoutUrl }/${ id }`);
    }
}

import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Gym } from '../../interfaces/gym';

@Service()
export class GymService {
    private readonly http = inject(HttpClient);

    gymUrl = environment.gymUrl();


    findAll() {
        return this.http.get<Gym[]>(this.gymUrl);
    }

    create(name: string) {
        return this.http.post<Gym>(this.gymUrl, { name });
    }

    update(gymId: number, name: string) {
        return this.http.patch<Gym>(`${ this.gymUrl }/${ gymId }`, { name });
    }

    delete(gymId: number) {
        return this.http.delete<void>(`${ this.gymUrl }/${ gymId }`);
    }
}

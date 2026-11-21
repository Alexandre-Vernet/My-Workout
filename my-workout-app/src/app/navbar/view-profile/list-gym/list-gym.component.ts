import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { GymService } from '../../../services/gym.service';
import { Gym } from '../../../../interfaces/gym';

@Component({
    imports: [],
    selector: 'app-list-gym',
    styleUrl: './list-gym.component.scss',
    templateUrl: './list-gym.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListGymComponent {

    private readonly gymService = inject(GymService);

    protected gyms = signal<Gym[]>([]);

    constructor() {
        effect(() => this.getGyms());
    }

    private getGyms() {
        this.gymService.findAll().subscribe(gyms => this.gyms.set(gyms));
    }
}

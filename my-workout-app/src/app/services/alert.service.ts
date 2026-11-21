import { Service, signal } from '@angular/core';
import { Alert } from '../../interfaces/alert';

@Service()
export class AlertService {

    readonly alert = signal<Alert | null>(null);

    show(alert: Alert | null) {
        this.alert.set(alert);
    }
}

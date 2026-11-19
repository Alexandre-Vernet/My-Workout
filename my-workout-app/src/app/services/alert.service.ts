import { Injectable, signal } from '@angular/core';
import { Alert } from '../../interfaces/alert';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    readonly alert = signal<Alert | null>(null);

    show(alert: Alert | null) {
        this.alert.set(alert);
    }
}

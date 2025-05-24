import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Alert } from '../../../../../libs/interfaces/alert';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    alert$: BehaviorSubject<Alert> = new BehaviorSubject<Alert>(null);

    constructor() {
    }
}

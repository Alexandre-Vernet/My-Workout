import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Alert } from '../../../interfaces/alert';
import { Message } from 'primeng/message';
import { AlertService } from '../../services/alert.service';

@Component({
    selector: 'app-alert',
    imports: [Message],
    templateUrl: './alert.component.html',
    styleUrl: './alert.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class AlertComponent implements OnInit {
    alert: Alert;

    constructor(
        private readonly alertService: AlertService
    ) {
    }

    ngOnInit() {
        this.alertService.alert$
            .subscribe(alert => {
                this.alert = alert;

                // Hide modal after 4s
                // Attribute [life] on <p-message always hide alert if user click on close button
                if (alert?.severity === 'success') {
                    setTimeout(() => {
                        this.alert = null;
                    }, 4000);
                }
            });
    }
}

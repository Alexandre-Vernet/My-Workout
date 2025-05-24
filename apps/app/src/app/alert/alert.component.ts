import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Alert } from '../../../../../libs/interfaces/alert';
import { Message } from 'primeng/message';
import { AlertService } from '../services/alert.service';

@Component({
    selector: 'app-alert',
    imports: [CommonModule, Message],
    templateUrl: './alert.component.html',
    styleUrl: './alert.component.scss'
})
export class AlertComponent implements OnInit {
    alert: Alert;

    constructor(
        private readonly alertService: AlertService
    ) {
    }

    ngOnInit() {
        this.alertService.alert$
            .subscribe(alert => this.alert = alert);
    }
}

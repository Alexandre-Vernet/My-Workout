import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { DeviceDetectionService } from '../services/device-detection.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-desktop-version',
    imports: [CommonModule],
    templateUrl: './desktop-version.component.html',
    styleUrl: './desktop-version.component.scss',
})
export class DesktopVersionComponent implements OnInit {
    protected readonly environment = environment;

    constructor(
        private readonly deviceDetectionService: DeviceDetectionService,
        private readonly router: Router
    ) {
    }

    ngOnInit() {
        if (!this.deviceDetectionService.isDesktop()) {
            this.router.navigate(['/']);
        }
    }
}

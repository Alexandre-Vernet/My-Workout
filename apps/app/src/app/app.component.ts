import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NavbarComponent } from './navbar/navbar.component';
import { NgClass } from '@angular/common';
import { PrimeNG } from 'primeng/config';
import { ThemeService } from './theme/theme.service';
import { DeviceDetectionService } from './services/device-detection.service';
import { AlertComponent } from './alert/alert.component';

@Component({
    imports: [RouterModule, NavbarComponent, NgClass, AlertComponent],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

    isLoginPage = false;
    isIphone: boolean = false;

    constructor(
        private readonly sw: SwPush,
        private readonly swUpdate: SwUpdate,
        private router: Router,
        private primeng: PrimeNG,
        private readonly themeService: ThemeService,
        private readonly deviceDetection: DeviceDetectionService
    ) {
        if (environment.production) {
            // Force refresh PWA
            this.swUpdate.checkForUpdate();
            if (this.swUpdate.isEnabled) {
                this.swUpdate.versionUpdates.subscribe(event => {
                    if (event.type === 'VERSION_READY') {
                        window.location.reload();
                    }
                });
            }

            if (!('serviceWorker' in navigator)) {
                setTimeout(() => {
                    alert('Service workers are not supported in this browser');
                }, 1000);
            }

            if (!this.sw.isEnabled) {
                setTimeout(() => {
                    alert('Service workers are not enabled');
                }, 1000);
            }
        }
    }

    ngOnInit() {
        this.primeng.ripple.set(true);
        this.themeService.loadTheme();
        this.themeService.loadDarkMode();

        this.isIphone = this.deviceDetection.isIphone();

        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
            this.isLoginPage = event.url.includes('auth');
        });
    }
}

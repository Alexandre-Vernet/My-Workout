import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { NgClass } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { ThemeService } from './shared/theme/theme.service';
import { DeviceDetectionService } from './services/device-detection.service';
import { filter } from 'rxjs';
import { AlertComponent } from './shared/alert/alert.component';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    imports: [
        NavbarComponent,
        NgClass,
        AlertComponent,
        RouterOutlet
    ],
    styleUrls: ['app.component.scss']

})
export class AppComponent implements OnInit {

    hideNavbar = false;
    isDesktop: boolean = false;

    constructor(
        private readonly sw: SwPush,
        private readonly swUpdate: SwUpdate,
        private router: Router,
        private primeng: PrimeNG,
        private readonly themeService: ThemeService,
        private readonly deviceDetection: DeviceDetectionService,
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

        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
            this.hideNavbar = event.url.includes('auth') || event.url.includes('desktop');
        });


        if (this.deviceDetection.isDesktop()) {
            this.isDesktop = true;
            this.router.navigate(['desktop']);
        }
    }
}

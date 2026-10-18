import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { ThemeService } from './shared/theme/theme.service';
import { filter } from 'rxjs';
import { AlertComponent } from './shared/alert/alert.component';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { RestTimeBannerComponent } from "./shared/rest-time-banner/rest-time-banner.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    imports: [
        NavbarComponent,
        AlertComponent,
        RouterOutlet,
        RestTimeBannerComponent
    ],
    styleUrls: ['app.component.scss']

})
export class AppComponent implements OnInit {

    hideNavbar = false;

    private readonly sw = inject(SwPush);
    private readonly swUpdate = inject(SwUpdate);
    private readonly router = inject(Router);
    private readonly primeng = inject(PrimeNG);
    private readonly themeService = inject(ThemeService);
    private readonly destroyRef = inject(DestroyRef);

    constructor() {
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

        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((event: NavigationEnd) => this.hideNavbar = event.url.includes('auth') || event.url.includes('desktop'));
    }
}

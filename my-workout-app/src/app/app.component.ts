import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavbarComponent } from './navbar/navbar.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ThemeService } from './shared/theme/theme.service';
import { filter, map } from 'rxjs';
import { AlertComponent } from './shared/alert/alert.component';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { RestTimeBannerComponent } from "./shared/rest-time-banner/rest-time-banner.component";

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    imports: [
        NavbarComponent,
        AlertComponent,
        RouterOutlet,
        RestTimeBannerComponent
    ],
    styleUrls: ['app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class AppComponent implements OnInit {
    private readonly sw = inject(SwPush);
    private readonly swUpdate = inject(SwUpdate);
    private readonly router = inject(Router);
    private readonly themeService = inject(ThemeService);

    protected readonly hideNavbar = toSignal(
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map(event => event.url.includes('auth') || event.url.includes('desktop'))
        ),
        { initialValue: false }
    );

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
        this.themeService.loadTheme();
        this.themeService.loadDarkMode();
    }
}

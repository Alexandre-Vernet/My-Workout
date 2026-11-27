import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavbarComponent } from './navbar/navbar.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ThemeService } from './shared/theme/theme.service';
import { filter, map } from 'rxjs';
import { AlertComponent } from './shared/alert/alert.component';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { RestTimeBannerComponent } from "./shared/rest-time-banner/rest-time-banner.component";
import { I18N } from './shared/i18n/i18n';

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
export class AppComponent {
    private readonly sw = inject(SwPush);
    private readonly swUpdate = inject(SwUpdate);
    private readonly router = inject(Router);
    private readonly themeService = inject(ThemeService);

    private readonly i18n = I18N.common.app;

    protected readonly hideNavbar = toSignal(
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map(event => event.url.includes('auth') || event.url.includes('desktop'))
        ),
        { initialValue: false }
    );

    constructor() {
        effect(() => {
            this.themeService.loadTheme();
            this.themeService.loadDarkMode();
        });

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
                    alert(this.i18n.serviceWorkerNotSupported);
                }, 1000);
            }

            if (!this.sw.isEnabled) {
                setTimeout(() => {
                    alert(this.i18n.serviceWorkerNotEnabled);
                }, 1000);
            }
        }
    }
}

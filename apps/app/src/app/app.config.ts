import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideServiceWorker } from '@angular/service-worker';
import { presetCyan } from './theme/preset-cyan';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(appRoutes, withInMemoryScrolling({
            scrollPositionRestoration: 'top'
        })),
        provideHttpClient(),
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: presetCyan
            }
        }), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
        })
    ]
};


import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideServiceWorker } from '@angular/service-worker';
import { definePreset } from '@primeng/themes';


const preset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#e0f7fa',
            100: '#b2ebf2',
            200: '#80deea',
            300: '#4dd0e1',
            400: '#26c6da',
            500: '#00bcd4',
            600: '#00acc1',
            700: '#0097a7',
            800: '#00838f',
            900: '#006064',
            950: '#004d4f'
        }
    }
});

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(appRoutes),
        provideHttpClient(),
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: preset
            }
        }), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
        })
    ]
};


import { ApplicationConfig, importProvidersFrom, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { presetCyan } from './theme/preset-cyan';
import { authInterceptor } from './auth/auth.interceptor';
import { CommonModule } from '@angular/common';
import { provideIonicAngular } from '@ionic/angular/standalone';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(appRoutes, withInMemoryScrolling({
            scrollPositionRestoration: 'top',
            anchorScrolling: 'enabled'
        })),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: presetCyan,
                options: {
                    darkModeSelector: '.dark-mode'
                }
            }
        }),

      importProvidersFrom(CommonModule),
      provideIonicAngular(),
      { provide: LOCALE_ID, useValue: 'fr-FR' },
]
};


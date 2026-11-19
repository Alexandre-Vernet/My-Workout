import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { AuthService } from './auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard = () => {
    const router = inject(Router);
    const alertService = inject(AlertService);
    const authService = inject(AuthService);

    if (!authService.hasToken()) {
        alertService.show({
            severity: 'error',
            message: 'Vous devez être connecté pour accéder à cette page'
        });
        return router.createUrlTree(['/auth/login']);
    }

    return authService.getCurrentUser()
        .pipe(
            map(() => true),
            catchError(() => {
                alertService.show({
                    severity: 'error',
                    message: 'Vous devez être connecté pour accéder à cette page'
                });
                return of(router.createUrlTree(['/auth/login']));
            })
        );
};

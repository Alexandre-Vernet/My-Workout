import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { catchError, map, of } from 'rxjs';
import { MenuUrls } from '../shared/menu-urls';

export const defaultHomePageGuard = () => {
    const router = inject(Router);
    const authService = inject(AuthService);

    if (!authService.hasToken()) {
        return router.createUrlTree([MenuUrls.library]);
    }

    return authService.getCurrentUser()
        .pipe(
            map(() => router.createUrlTree([MenuUrls.workout])),
            catchError(() => of(router.createUrlTree([MenuUrls.library])))
        );
};

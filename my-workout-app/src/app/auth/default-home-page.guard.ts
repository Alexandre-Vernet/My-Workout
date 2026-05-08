import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { catchError, map, of } from 'rxjs';
import { MenuUrls } from '../shared/menu-urls';

export const defaultHomePageGuard = () => {
    const router = inject(Router);
    const authService = inject(AuthService);


    return authService.getCurrentUser()
        .pipe(
            map(() => {
                router.navigate([MenuUrls.workout]);
                return false;
            }),
            catchError(() => {
                router.navigate([MenuUrls.library]);
                return of(false);
            })
        );
};

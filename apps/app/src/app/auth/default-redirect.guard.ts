import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, switchMap, take } from 'rxjs';
import { AuthService } from './auth.service';

export const defaultRedirect = (): Observable<boolean> => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.signInWithAccessToken()
        .pipe(
            take(1),
            switchMap(({ user }) => {
                if (!user) {
                    return router.navigate(['/library']);
                } else {
                    return router.navigate(['/workout']);
                }
            }),
            catchError(() => {
                return router.navigate(['/library']);
            })
        );
};

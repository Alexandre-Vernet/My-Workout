import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { AuthService } from './auth.service';

export const authGuard = (): Observable<boolean> => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.signInWithAccessToken()
        .pipe(
            switchMap(({ user }) => {
                if (!user) {
                    return handleError(router);
                }
                return of(true);
            }),
            catchError(() => {
                return handleError(router);
            })
        );
};

const handleError = (router: Router): Observable<boolean> => {
    router.navigate(['/auth/sign-in']);
    return of(false);
};

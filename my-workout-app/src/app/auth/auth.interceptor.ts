import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { AlertService } from "../services/alert.service";


export const authInterceptor = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const authService = inject(AuthService);
    const alertService = inject(AlertService);

    const token = localStorage.getItem('access-token');
    if (token) {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${ token }`
            }
        });
    }
    return next(request)
        .pipe(
            tap(() => alertService.alert$.next(null)),
            catchError((err) => {
                if (err.status === 401 || err.status === 403) {
                    return authService.refresh()
                        .pipe(
                            switchMap(({ accessToken }) => {
                                const newRequest = request.clone({
                                    setHeaders: {
                                        Authorization: `Bearer ${ accessToken }`
                                    }
                                });
                                return next(newRequest);
                            }),
                            catchError(() => throwError(() => new Error('Unauthorized')))
                        );
                }

                return throwError(() => err);

            })
        );
};

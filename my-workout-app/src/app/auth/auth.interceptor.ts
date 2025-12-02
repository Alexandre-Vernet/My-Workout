import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { catchError, switchMap, throwError } from "rxjs";
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";
import { AlertService } from "../services/alert.service";

export const authInterceptor = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const alertService = inject(AlertService);

    if (request.url.endsWith('/auth/refresh')) {
        return next(request);
    }

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
            catchError((err) => {
                if (err.status === 401) {
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
                            catchError(() => handleError(router, alertService, err))
                        );
                }
                return handleError(router, alertService, err);

            })
        );
};

const handleError = (router: Router, alertService: AlertService, err) => {
    alertService.alert$.next({
        severity: 'error',
        message: 'Vous devez être connecté pour accéder à cette page'
    });
    router.navigate(['/auth/sign-in']);
    return throwError(() => err);
}

import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { AlertService } from "../services/alert.service";

// Requests to these endpoints must never trigger a refresh-and-retry below: they are called
// while logged out (login/register) or are the refresh call itself, so retrying them through
// authService.refresh() would recurse back into this same interceptor on every failure instead
// of ever surfacing an error.
const AUTH_ENDPOINTS_EXEMPT_FROM_REFRESH = ['/auth/login', '/auth/register', '/auth/refresh'];

export const authInterceptor = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const authService = inject(AuthService);
    const alertService = inject(AlertService);

    const token = authService.getAccessToken();
    if (token) {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${ token }`
            }
        });
    }

    const isExemptFromRefresh = AUTH_ENDPOINTS_EXEMPT_FROM_REFRESH.some(endpoint => request.url.endsWith(endpoint));

    return next(request)
        .pipe(
            tap(() => alertService.show(null)),
            catchError((err) => {
                if (!isExemptFromRefresh && (err.status === 401 || err.status === 403)) {
                    return authService.refresh()
                        .pipe(
                            switchMap((authResponse) => {
                                if (!authResponse) {
                                    authService.signOut();
                                    return throwError(() => new Error('Unauthorized'));
                                }
                                const newRequest = request.clone({
                                    setHeaders: {
                                        Authorization: `Bearer ${ authResponse.accessToken }`
                                    }
                                });
                                return next(newRequest);
                            }),
                            catchError(() => {
                                authService.signOut();
                                return throwError(() => new Error('Unauthorized'));
                            })
                        );
                }

                return throwError(() => err);

            })
        );
};

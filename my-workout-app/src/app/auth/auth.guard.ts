import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from "../services/alert.service";

export const authGuard = () => {
    const router = inject(Router);
    const alertService = inject(AlertService);

    const access = localStorage.getItem('access-token');
    const refresh = localStorage.getItem('refresh-token');

    if (!access && !refresh) {
        router.navigate(['/auth/sign-in']);
        alertService.alert$.next({
            severity: 'error',
            message: 'Vous devez être connecté pour accéder à cette page'
        });
        return false;
    }

    return true;
};

import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
    const router = inject(Router);
    const access = localStorage.getItem('access-token');
    const refresh = localStorage.getItem('refresh-token');

    if (!access && !refresh) {
        router.navigate(['/auth/sign-in']);
        return false;
    }

    return true;
};

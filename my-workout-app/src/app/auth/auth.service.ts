import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../../interfaces/User';
import { AuthResponse } from '../../interfaces/AuthResponse';
import { LoginRequest } from "../../interfaces/LoginRequest";
import { RegisterRequest } from "../../interfaces/RegisterRequest";
import { UpdateUserRequest } from "../../interfaces/UpdateUserRequest";

@Service()
export class AuthService {
    private readonly http = inject(HttpClient);


    authUrl = environment.authUrl();

    // Cached to avoid hitting /auth/me on every navigation (see guards).
    private currentUser$: Observable<User> | null = null;

    // Single access point for the access token, to ease a future migration to a backend httpOnly cookie.
    getAccessToken(): string | null {
        return localStorage.getItem('access-token');
    }

    hasToken(): boolean {
        return !!this.getAccessToken();
    }

    login(loginRequest: LoginRequest) {
        return this.http.post<AuthResponse>(`${ this.authUrl }/login`, loginRequest)
            .pipe(
                tap(({ accessToken, refreshToken }) => {
                    localStorage.setItem('access-token', accessToken);
                    localStorage.setItem('refresh-token', refreshToken);
                    this.currentUser$ = null;
                })
            );
    }

    register(registerRequest: RegisterRequest) {
        return this.http.post<{ accessToken: string, user: User }>(`${ this.authUrl }/register`, registerRequest)
            .pipe(switchMap(() => this.login(registerRequest)));
    }

    getCurrentUser() {
        if (!this.currentUser$) {
            this.currentUser$ = this.http.get<User>(`${ this.authUrl }/me`)
                .pipe(shareReplay(1));
        }
        return this.currentUser$;
    }

    refresh(): Observable<AuthResponse | null> {
        const refreshToken = localStorage.getItem('refresh-token');
        if (!refreshToken) {
            return of(null);
        }
        return this.http.post<AuthResponse>(`${ this.authUrl }/refresh`, refreshToken)
            .pipe(
                tap(({ accessToken, refreshToken }) => {
                    localStorage.setItem('access-token', accessToken);
                    localStorage.setItem('refresh-token', refreshToken);
                })
            );
    }

    // Changing the email or password revokes every token server-side, hence the sign-out.
    updateUser(user: UpdateUserRequest) {
        return this.http.patch<User>(this.authUrl, user)
            .pipe(tap(() => this.signOut()));
    }

    deleteAccount() {
        return this.http.delete<void>(`${ this.authUrl }`);
    }

    signOut() {
        localStorage.removeItem('access-token');
        localStorage.removeItem('refresh-token');
        this.currentUser$ = null;
    }
}

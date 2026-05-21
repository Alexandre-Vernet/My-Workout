import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, switchMap, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../../interfaces/User';
import { AuthResponse } from '../../interfaces/AuthResponse';
import { LoginRequest } from "../../interfaces/LoginRequest";
import { RegisterRequest } from "../../interfaces/RegisterRequest";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    authUrl = environment.authUrl();

    constructor(
        private readonly http: HttpClient
    ) {
    }

    login(loginRequest: LoginRequest) {
        return this.http.post<AuthResponse>(`${ this.authUrl }/login`, loginRequest)
            .pipe(
                tap(({ accessToken, refreshToken }) => {
                    localStorage.setItem('access-token', accessToken);
                    localStorage.setItem('refresh-token', refreshToken);
                })
            );
    }

    register(registerRequest: RegisterRequest) {
        return this.http.post<{ accessToken: string, user: User }>(`${ this.authUrl }/register`, registerRequest)
            .pipe(switchMap(() => this.login(registerRequest)));
    }

    getCurrentUser() {
        return this.http.get<User>(`${ this.authUrl }/me`);
    }

    refresh() {
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

    updateUser(user: User) {
        return this.getCurrentUser()
            .pipe(
                switchMap((u) => this.http.patch<User>(`${ this.authUrl }/${ u.id }`, user)
                    .pipe(
                        tap(() => this.signOut())
                    )),
            );
    }

    deleteAccount() {
        return this.http.delete<void>(`${ this.authUrl }`);
    }

    signOut() {
        localStorage.removeItem('access-token');
        localStorage.removeItem('refresh-token');
    }
}

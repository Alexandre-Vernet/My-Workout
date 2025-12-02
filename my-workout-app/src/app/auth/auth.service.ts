import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, from, map, switchMap, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../../interfaces/user';
import { Preferences } from "@capacitor/preferences";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private userSubject = new BehaviorSubject<User>(null);
    user$ = this.userSubject.asObservable();

    authUrl = environment.authUrl();
    error = '';

    constructor(
        private http: HttpClient
    ) {
    }

    signIn(user: User) {
        return this.http.post<{ accessToken: string, refreshToken: string }>(`${ this.authUrl }/sign-in`, user)
            .pipe(
                tap(({ accessToken, refreshToken }) => {
                    this.userSubject.next(user);
                    localStorage.setItem('access-token', accessToken);
                    localStorage.setItem('refresh-token', refreshToken);
                }),
                switchMap(() => from(Preferences.set({
                    key: 'email',
                    value: user.email,
                }))),
            );
    }

    signUp(user: User) {
        return this.http.post<{ accessToken: string, user: User }>(`${ this.authUrl }/sign-up`, user)
            .pipe(
                tap(({ accessToken }) => localStorage.setItem('access-token', accessToken))
            );
    }

    getCurrentUser() {
        if (this.userSubject.value) {
            return this.user$;
        }

        return this.http.get<User>(`${ this.authUrl }/me`)
            .pipe(
                tap((user) => this.userSubject.next(user)),
                catchError(() => this.refresh()
                    .pipe(
                        map((e) => e.user)
                    )
                )
            );
    }

    refresh() {
        const refreshToken = localStorage.getItem('refresh-token');
        return this.http.post<{
            user: User,
            accessToken: string,
            refreshToken: string
        }>(`${ this.authUrl }/refresh`, { refreshToken })
            .pipe(
                tap(({ user, accessToken, refreshToken }) => {
                    this.userSubject.next(user);
                    localStorage.setItem('access-token', accessToken);
                    localStorage.setItem('refresh-token', refreshToken);
                })
            );
    }

    updateUser(user: User) {
        return this.http.put<User>(`${ this.authUrl }`, { user });
    }

    sendEmailForgotPassword(email: string) {
        return this.http.post<{ linkResetPassword: string }>(`${ this.authUrl }/send-email-reset-password`, { email });
    }

    updatePassword(userId: number, password: string) {
        return this.http.put<{
            user: User,
            accessToken: string
        }>(`${ this.authUrl }/reset-password/${ userId }`, { password })
            .pipe(
                tap(({ user, accessToken }) => {
                    this.userSubject.next(user);
                    localStorage.setItem('access-token', accessToken);
                })
            );
    }

    verifyToken(token: string) {
        return this.http.post<User>(`${ this.authUrl }/verify-token`, { token });
    }

    deleteAccount() {
        return this.http.delete<void>(`${ this.authUrl }`);
    }

    signOut() {
        this.userSubject.next(null);
        localStorage.removeItem('access-token');
        localStorage.removeItem('refresh-token');
        Preferences.remove({ key: 'email' });
    }
}

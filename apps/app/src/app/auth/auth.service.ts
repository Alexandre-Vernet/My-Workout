import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../../../../../libs/interfaces/user';

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

    signIn(user: User): Observable<{ user: User, accessToken: string }> {
        return this.http.post<{ user: User, accessToken: string }>(`${ this.authUrl }/sign-in`, user)
            .pipe(
                tap(({ user, accessToken }) => {
                    this.userSubject.next(user);
                    localStorage.setItem('accessToken', accessToken);
                })
            );
    }

    signUp(user: User): Observable<{ accessToken: string, user: User }> {
        return this.http.post<{ accessToken: string, user: User }>(`${ this.authUrl }/sign-up`, user)
            .pipe(
                tap(({ accessToken }) => localStorage.setItem('accessToken', accessToken))
            );
    }

    signInWithAccessToken(): Observable<{ user: User, accessToken: string }> {
        const accessToken = localStorage.getItem('accessToken');
        return this.http.post<{
            user: User,
            accessToken: string
        }>(`${ this.authUrl }/sign-in-with-access-token`, { accessToken })
            .pipe(
                tap(({ user, accessToken }) => {
                    this.userSubject.next(user);
                    localStorage.setItem('accessToken', accessToken);
                })
            );
    }

    updatePassword(password: string, confirmPassword: string): Observable<void> {
        const userId = this.userSubject.value.id;
        return this.http.put<void>(`${ this.authUrl }/update-password`, { userId, password, confirmPassword });
    }

    sendEmailForgotPassword(email: string): Observable<void> {
        return this.http.post<void>(`${ this.authUrl }/send-email-reset-password`, { email });
    }

    signOut(): void {
        this.userSubject.next(null);
        localStorage.removeItem('accessToken');
    }
}

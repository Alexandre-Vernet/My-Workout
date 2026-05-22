import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root',
})
export class PasswordResetTokenService {

    passwordResetTokenUrl = environment.passwordResetTokenUrl();

    constructor(
        private readonly http: HttpClient
    ) {
    }

    forgotPassword(email: string) {
        return this.http.get<{ link: string }>(`${ this.passwordResetTokenUrl }/forgot-password`, {
            params: { email }
        });
    }

    isTokenValid(token: string) {
        return this.http.get<boolean>(`${ this.passwordResetTokenUrl }/valid`, {
            params: {
                token
            }
        });
    }

    resetPassword(token: string, password: string) {
        return this.http.post<void>(`${ this.passwordResetTokenUrl }/reset-password`, { token, password });
    }
}

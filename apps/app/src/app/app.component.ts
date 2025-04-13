import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { take } from 'rxjs';

@Component({
    imports: [RouterModule],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

    constructor(
        private readonly authService: AuthService
    ) {
    }

    ngOnInit() {
        this.authService.signInWithAccessToken()
            .pipe(take(1))
            .subscribe();
    }
}

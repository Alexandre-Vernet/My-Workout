import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ChangeThemeComponent } from './change-theme/change-theme.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { Alert } from '../../../interfaces/alert';
import { AccountActionsComponent } from './account-actions/account-actions.component';
import { ThemeService } from '../../shared/theme/theme.service';
import { AlertService } from '../../services/alert.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../../interfaces/user';

@Component({
    selector: 'app-view-profile',
    imports: [CommonModule, ReactiveFormsModule, FormsModule, ChangeThemeComponent, ManageAccountComponent, AccountActionsComponent, RouterLink],
    templateUrl: './view-profile.component.html',
    styleUrl: './view-profile.component.scss',
    standalone: true,
    providers: [ConfirmationService]
})
export class ViewProfileComponent implements OnInit {

    isDarkMode = false;

    user: User;

    constructor(
        private readonly alertService: AlertService,
        private readonly themeService: ThemeService,
        private readonly authService: AuthService
    ) {
    }

    ngOnInit() {
        this.isDarkMode = this.themeService.isDarkMode();
        this.authService.getCurrentUser()
            .subscribe((user) => this.user = user);
    }

    updateDarkMode(value: boolean) {
        this.isDarkMode = value;
    }

    displayAlert(alert: Alert) {
        this.alertService.alert$.next(alert);
    }
}

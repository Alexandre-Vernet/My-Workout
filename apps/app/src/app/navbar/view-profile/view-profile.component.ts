import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService } from 'primeng/api';
import { ChangeThemeComponent } from './change-theme/change-theme.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { Alert } from '../../../../../../libs/interfaces/alert';
import { AccountActionsComponent } from './account-actions/account-actions.component';
import { ThemeService } from '../../theme/theme.service';
import { AlertService } from '../../services/alert.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-view-profile',
    imports: [CommonModule, ReactiveFormsModule, DropdownModule, FormsModule, ChangeThemeComponent, ManageAccountComponent, AccountActionsComponent, RouterLink],
    templateUrl: './view-profile.component.html',
    styleUrl: './view-profile.component.scss',
    standalone: true,
    providers: [ConfirmationService]
})
export class ViewProfileComponent implements OnInit {

    isDarkMode = false;

    constructor(
        private readonly alertService: AlertService,
        private readonly themeService: ThemeService
    ) {
    }

    ngOnInit() {
        this.isDarkMode = this.themeService.isDarkMode();
    }

    updateDarkMode(value: boolean) {
        this.isDarkMode = value;
    }

    displayAlert(alert: Alert) {
        this.alertService.alert$.next(alert);
    }
}

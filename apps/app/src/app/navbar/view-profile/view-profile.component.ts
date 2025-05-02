import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { Message } from 'primeng/message';
import { ConfirmationService } from 'primeng/api';
import { ChangeThemeComponent } from './change-theme/change-theme.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { Alert } from '../../../../../../libs/interfaces/alert';
import { AccountActionsComponent } from './account-actions/account-actions.component';

@Component({
    selector: 'app-view-profile',
    imports: [CommonModule, ReactiveFormsModule, DropdownModule, FormsModule, Message, ChangeThemeComponent, ManageAccountComponent, AccountActionsComponent],
    templateUrl: './view-profile.component.html',
    styleUrl: './view-profile.component.scss',
    standalone: true,
    providers: [ConfirmationService]
})
export class ViewProfileComponent {

    alert: Alert;

    isDarkMode = localStorage.getItem('dark-mode') === 'true';

    updateDarkMode(value: boolean) {
        this.isDarkMode = value;
    }

    displayAlert(alert: Alert) {
        this.alert = alert;
    }
}

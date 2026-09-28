import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ChangeThemeComponent } from './change-theme/change-theme.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { Alert } from '../../../interfaces/alert';
import { AccountActionsComponent } from './account-actions/account-actions.component';
import { AlertService } from '../../services/alert.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../../interfaces/User';

@Component({
    selector: 'app-view-profile',
    imports: [ReactiveFormsModule, FormsModule, ChangeThemeComponent, ManageAccountComponent, AccountActionsComponent, RouterLink],
    templateUrl: './view-profile.component.html',
    styleUrl: './view-profile.component.scss',
    standalone: true,
    providers: [ConfirmationService]
})
export class ViewProfileComponent implements OnInit {

    user: User;

    private readonly alertService = inject(AlertService);
    private readonly authService = inject(AuthService);

    ngOnInit() {
        this.authService.getCurrentUser()
            .subscribe((user) => this.user = user);
    }

    displayAlert(alert: Alert) {
        this.alertService.alert$.next(alert);
    }
}

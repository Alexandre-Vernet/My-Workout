import { Component, computed, inject, OnInit } from '@angular/core';
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
    imports: [ChangeThemeComponent, ManageAccountComponent, AccountActionsComponent, RouterLink],
    templateUrl: './view-profile.component.html',
    styleUrl: './view-profile.component.scss',
    standalone: true
})
export class ViewProfileComponent implements OnInit {

    user: User | undefined;

    protected readonly initial = computed(() => this.user?.email.charAt(0).toUpperCase() ?? '');

    private readonly alertService = inject(AlertService);
    private readonly authService = inject(AuthService);

    ngOnInit() {
        this.authService.getCurrentUser()
            .subscribe((user) => this.user = user);
    }

    displayAlert(alert: Alert) {
        this.alertService.show(alert);
    }
}

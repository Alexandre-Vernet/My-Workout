import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChangeThemeComponent } from './change-theme/change-theme.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { Alert } from '../../../interfaces/alert';
import { AccountActionsComponent } from './account-actions/account-actions.component';
import { AlertService } from '../../services/alert.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { I18N } from '../../shared/i18n/i18n';
import { ListGymComponent } from './list-gym/list-gym.component';

@Component({
    selector: 'app-view-profile',
    imports: [ChangeThemeComponent, ManageAccountComponent, AccountActionsComponent, RouterLink, ListGymComponent],
    templateUrl: './view-profile.component.html',
    styleUrl: './view-profile.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class ViewProfileComponent {

    private readonly alertService = inject(AlertService);
    private readonly authService = inject(AuthService);

    protected readonly i18n = I18N.viewProfile.viewProfile;
    protected readonly user = toSignal(this.authService.getCurrentUser());
    protected readonly initial = computed(() => this.user()?.email.charAt(0).toUpperCase() ?? '');

    protected displayAlert(alert: Alert) {
        this.alertService.show(alert);
    }
}

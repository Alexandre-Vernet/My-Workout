import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { I18N } from '../i18n/i18n';

@Component({
  selector: 'app-not-found',
    imports: [
        RouterLink
    ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {

    protected readonly i18n = I18N.common.notFound;
}

import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { MenuUrls } from '../shared/menu-urls';

interface NavItem {
    readonly route: string;
    readonly label: string;
    readonly icon: 'library' | 'calendar' | 'workout' | 'stats' | 'profile';
    readonly isMain?: boolean;
}

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

    protected readonly navItems: readonly NavItem[] = [
        { route: '/library', label: 'Bibliothèque', icon: 'library' },
        { route: '/calendar', label: 'Calendrier', icon: 'calendar' },
        { route: '/workout', label: 'Séance', icon: 'workout', isMain: true },
        { route: '/stats', label: 'Stats', icon: 'stats' },
        { route: '/user', label: 'Profil', icon: 'profile' }
    ];

    private readonly router = inject(Router);

    // Reflects the current URL as a signal so the active item (and the sliding
    // highlight behind it) stays in sync without ever touching the DOM directly.
    private readonly currentUrl = toSignal(
        this.router.events.pipe(
            filter((event): event is NavigationEnd => event instanceof NavigationEnd),
            map((event) => event.urlAfterRedirects)
        ),
        { initialValue: this.router.url }
    );

    protected readonly activeIndex = computed(() => {
        const url = this.currentUrl();

        if (url.includes(MenuUrls.library)) {
            return 0;
        }
        if (url.includes(MenuUrls.calendar)) {
            return 1;
        }
        if (url.includes(MenuUrls.workout)) {
            return 2;
        }
        if (url.includes(MenuUrls.stats)) {
            return 3;
        }
        if (url.includes(MenuUrls.user) || url.includes(MenuUrls.admin)) {
            return 4;
        }
        return 2;
    });
}

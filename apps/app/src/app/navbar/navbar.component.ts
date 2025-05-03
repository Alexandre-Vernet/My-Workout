import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MenuUrls } from '../shared/menu-urls';
import { delay, filter } from 'rxjs';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterViewInit {

    constructor(
        private router: Router
    ) {
    }

    ngAfterViewInit(): void {
        const body = document.body;
        const menu = body.querySelector('.menu') as HTMLElement;
        const menuItems = menu.querySelectorAll('.menu__item');
        const menuBorder = menu.querySelector('.menu__border') as HTMLElement;
        const icons = menu.querySelectorAll('.icon') as NodeListOf<HTMLElement>;
        let activeItem;

        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                delay(5)
            )
            .subscribe((event: NavigationEnd) => {
                const url = event.urlAfterRedirects;

                let activeIndex: number;

                if (url.includes(MenuUrls.library)) {
                    activeIndex = 0;
                } else if (url.includes(MenuUrls.calendar)) {
                    activeIndex = 1;
                } else if (url.includes(MenuUrls.workout)) {
                    activeIndex = 2;
                } else if (url.includes(MenuUrls.user)) {
                    activeIndex = 4;
                } else {
                    activeIndex = 2;
                }

                activeItem = menuItems[activeIndex] as HTMLElement;
                activeItem.classList.add('active');
                offsetMenuBorder(activeItem, menuBorder);
            });

        function clickItem(item: HTMLElement) {
            menu.style.removeProperty('--timeOut');
            menuBorder.classList.add('menu__border_transition');

            icons.forEach(icon => {
                icon.classList.add('icon-stroke-dasharray');
                icon.classList.add('active');
            });

            if (activeItem === item) return;

            activeItem.classList.remove('active');
            item.classList.add('active');
            item.classList.add('menu__item_active');
            item.classList.add('menu__item_active_before');
            activeItem = item;

            offsetMenuBorder(activeItem, menuBorder);
        }

        function offsetMenuBorder(element: HTMLElement, menuBorder: HTMLElement) {
            const offsetActiveItem = element.getBoundingClientRect();
            const left = Math.floor(
                offsetActiveItem.left - menu.offsetLeft - (menuBorder.offsetWidth - offsetActiveItem.width) / 2
            ) + 'px';

            menuBorder.style.transform = `translate3d(${ left }, 0 , 0)`;
        }

        menuItems.forEach(item => {
            item.addEventListener('click', () => clickItem(item as HTMLElement));
        });

        window.addEventListener('resize', () => {
            offsetMenuBorder(activeItem, menuBorder);
            menu.style.setProperty('--timeOut', 'none');
        });
    }
}

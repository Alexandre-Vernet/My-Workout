import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterViewInit {

    ngAfterViewInit(): void {
        const activeIndex = 2;

        const body = document.body;
        const menu = body.querySelector('.menu') as HTMLElement;
        const menuItems = menu.querySelectorAll('.menu__item');
        const menuBorder = menu.querySelector('.menu__border') as HTMLElement;
        let activeItem = menuItems[activeIndex] as HTMLElement;

        menuItems.forEach(item => {
            item.classList.remove('active');
        });

        activeItem.classList.add('active');

        offsetMenuBorder(activeItem, menuBorder);

        function clickItem(item: HTMLElement) {
            menu.style.removeProperty('--timeOut');

            if (activeItem === item) return;

            activeItem.classList.remove('active');

            item.classList.add('active');


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

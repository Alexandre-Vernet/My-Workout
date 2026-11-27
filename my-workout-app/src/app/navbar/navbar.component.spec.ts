import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NavbarComponent } from './navbar.component';

// NavbarComponent derives its active item from Router.events/Router.url only, so a
// minimal Router stub is enough to drive it without a real router/route table.
describe('NavbarComponent', () => {
    let component: NavbarComponent;
    let events: Subject<NavigationEnd>;

    function setup(initialUrl: string) {
        events = new Subject<NavigationEnd>();
        const routerStub = { url: initialUrl, events } as unknown as Router;

        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [{ provide: Router, useValue: routerStub }]
        });

        component = TestBed.runInInjectionContext(() => new NavbarComponent());
    }

    function navigateTo(url: string) {
        events.next(new NavigationEnd(1, url, url));
    }

    it('highlights the library item for /library', () => {
        setup('/library');
        expect(component['activeIndex']()).toBe(0);
    });

    it('highlights the calendar item for /calendar', () => {
        setup('/calendar');
        expect(component['activeIndex']()).toBe(1);
    });

    it('highlights the stats item for /stats', () => {
        setup('/stats');
        expect(component['activeIndex']()).toBe(3);
    });

    it('highlights the profile item for both /user and /admin routes', () => {
        setup('/user');
        expect(component['activeIndex']()).toBe(4);

        setup('/admin/update-exercise/3');
        expect(component['activeIndex']()).toBe(4);
    });

    it('falls back to the workout item for an unrecognized route', () => {
        setup('/not-a-known-route');
        expect(component['activeIndex']()).toBe(2);
    });

    it('updates the active item when the router navigates', () => {
        setup('/library');
        expect(component['activeIndex']()).toBe(0);

        navigateTo('/stats');

        expect(component['activeIndex']()).toBe(3);
    });
});

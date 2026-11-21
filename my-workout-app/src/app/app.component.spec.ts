import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { Component } from '@angular/core';
import { AppComponent } from './app.component';
import { ThemeService } from './shared/theme/theme.service';

@Component({ template: '', standalone: true })
class StubComponent {
}

describe('AppComponent', () => {
    let fixture: ComponentFixture<AppComponent>;
    let router: Router;
    let themeService: ThemeService;

    beforeEach(() => {
        localStorage.clear();

        TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [
                provideRouter([{ path: '**', component: StubComponent }]),
                provideServiceWorker('ngsw-worker.js', { enabled: false })
            ]
        });

        fixture = TestBed.createComponent(AppComponent);
        router = TestBed.inject(Router);
        themeService = TestBed.inject(ThemeService);
    });

    it('loads the saved theme and dark mode on init', () => {
        const loadThemeSpy = vi.spyOn(themeService, 'loadTheme');
        const loadDarkModeSpy = vi.spyOn(themeService, 'loadDarkMode');

        fixture.detectChanges();

        expect(loadThemeSpy).toHaveBeenCalledOnce();
        expect(loadDarkModeSpy).toHaveBeenCalledOnce();
    });

    it('hides the navbar on auth pages', async () => {
        fixture.detectChanges();

        await router.navigateByUrl('/auth/login');

        expect(fixture.componentInstance['hideNavbar']()).toBe(true);
    });

    it('shows the navbar on regular pages', async () => {
        fixture.detectChanges();

        await router.navigateByUrl('/calendar');

        expect(fixture.componentInstance['hideNavbar']()).toBe(false);
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeThemeComponent } from './change-theme.component';

describe('ChangeThemeComponent', () => {
    let fixture: ComponentFixture<ChangeThemeComponent>;
    let component: ChangeThemeComponent;

    beforeEach(() => {
        localStorage.clear();
        document.documentElement.classList.remove('dark-mode');

        TestBed.configureTestingModule({
            imports: [ChangeThemeComponent]
        });

        fixture = TestBed.createComponent(ChangeThemeComponent);
        component = fixture.componentInstance;
    });

    it('lists every available preset for the theme picker', () => {
        expect(component.presetsArray.length).toBeGreaterThan(0);
        expect(component.presetsArray.map(p => p.key)).toContain('cyan');
    });

    it('reads the current theme and dark mode state from localStorage on init', () => {
        localStorage.setItem('theme', 'emerald');
        localStorage.setItem('dark-mode', 'true');

        fixture.detectChanges();

        expect(component.selectedTheme).toBe('emerald');
        expect(component.isCheckedDarkMode).toBe(true);
    });

    it('updatePreset() persists the chosen theme name', () => {
        component.updatePreset('emerald');

        expect(localStorage.getItem('theme')).toBe('emerald');
    });

    it('toggleDarkMode() toggles the dark-mode class and persists the state', () => {
        component.isCheckedDarkMode = true;

        component.toggleDarkMode();

        expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
        expect(localStorage.getItem('dark-mode')).toBe('true');
    });

    afterEach(() => {
        document.documentElement.classList.remove('dark-mode');
    });
});

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
    let service: ThemeService;

    beforeEach(() => {
        localStorage.clear();
        document.documentElement.classList.remove('dark-mode');
        service = new ThemeService();
    });

    afterEach(() => {
        document.documentElement.classList.remove('dark-mode');
    });

    it('isDarkMode() reflects the stored preference', () => {
        expect(service.isDarkMode()).toBe(false);

        localStorage.setItem('dark-mode', 'true');

        expect(service.isDarkMode()).toBe(true);
    });

    describe('loadTheme()', () => {
        it('defaults to the cyan preset when no theme was ever chosen', () => {
            service.loadTheme();

            expect(localStorage.getItem('theme')).toBe('cyan');
        });

        it('applies the previously saved theme', () => {
            localStorage.setItem('theme', 'emerald');
            const updateThemeSpy = vi.spyOn(service, 'updateTheme');

            service.loadTheme();

            expect(updateThemeSpy).toHaveBeenCalledWith(expect.anything(), 'emerald');
        });
    });

    it('updateTheme() persists the chosen preset name', () => {
        service.updateTheme({} as never, 'violet');

        expect(localStorage.getItem('theme')).toBe('violet');
    });

    describe('loadDarkMode()', () => {
        it('defaults dark mode to false when never set', () => {
            service.loadDarkMode();

            expect(localStorage.getItem('dark-mode')).toBe('false');
            expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
        });

        it('re-applies dark mode when it was previously enabled', () => {
            localStorage.setItem('dark-mode', 'true');

            service.loadDarkMode();

            expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
        });
    });

    describe('toggleDarkMode()', () => {
        it('adds the dark-mode class and persists true', () => {
            service.toggleDarkMode(true);

            expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
            expect(localStorage.getItem('dark-mode')).toBe('true');
        });

        it('removes the dark-mode class and persists false', () => {
            document.documentElement.classList.add('dark-mode');

            service.toggleDarkMode(false);

            expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
            expect(localStorage.getItem('dark-mode')).toBe('false');
        });
    });
});

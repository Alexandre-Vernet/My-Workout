import { Injectable } from '@angular/core';
import { Theme, updatePreset } from '@primeuix/styled';
import { presets, PresetName } from './presets';

type Preset = (typeof presets)[PresetName]['preset'];

// Single <style> element holding the theme's CSS variables, pushed by applyTheme()
// below instead of PrimeNG's own theme bootstrap (removed along with the rest of
// the library — see @primeuix/styled.Theme, which is what PrimeNG called internally).
const THEME_STYLE_ID = 'app-theme-vars';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    isDarkMode() {
        return localStorage.getItem('dark-mode') === 'true';
    }

    loadTheme() {
        const presetName = localStorage.getItem('theme') ?? 'cyan';

        localStorage.setItem('theme', presetName);
        this.updateTheme(presets[presetName as PresetName].preset, presetName);
    }

    updateTheme(preset: Preset, presetName: string) {
        // Re-seeded on every call rather than once at bootstrap: updatePreset()'s merge
        // base is reset anyway (preset is the full object, not a fragment), and this
        // keeps the call safe however it's reached (e.g. directly from a test, without
        // ever going through loadTheme() first).
        Theme.setTheme({ options: { darkModeSelector: '.dark-mode' } });
        updatePreset(preset);
        localStorage.setItem('theme', presetName);
        this.applyTheme();
    }


    loadDarkMode() {
        const darkModeEnable = localStorage.getItem('dark-mode');
        if (!darkModeEnable) {
            localStorage.setItem('dark-mode', 'false');
        }

        if (darkModeEnable === 'true') {
            this.toggleDarkMode(true);
        }
    }

    toggleDarkMode(isCheckedDarkMode: boolean) {
        const element = document.querySelector('html');
        element?.classList.toggle('dark-mode', isCheckedDarkMode);
        localStorage.setItem('dark-mode', isCheckedDarkMode ? 'true' : 'false');
    }

    // Pushes the current theme's CSS variables (--p-primary-*, the full color
    // ramps, dark-mode-scoped overrides...) into the document. Every screen in the
    // app reads these variables directly, so this has to run before anything renders.
    private applyTheme() {
        const { primitive, semantic, global } = Theme.getCommon(undefined, undefined);
        const css = `${ primitive?.css ?? '' }${ semantic?.css ?? '' }${ global?.css ?? '' }`;

        let styleElement = document.getElementById(THEME_STYLE_ID) as HTMLStyleElement | null;
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = THEME_STYLE_ID;
            document.head.appendChild(styleElement);
        }
        styleElement.textContent = css;
    }
}

import { Injectable } from '@angular/core';
import { updatePreset } from '@primeng/themes';
import { presets } from './presets';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    isDarkMode() {
        return localStorage.getItem('dark-mode') === 'true';
    }

    loadTheme() {
        const presetName = localStorage.getItem('theme');
        if (!presetName) {
            localStorage.setItem('theme', 'cyan');
            return;
        }

        this.updateTheme(presets[presetName], presetName);
    }

    updateTheme(preset: string, presetName: string) {
        updatePreset(preset);
        localStorage.setItem('theme', presetName);
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
        element.classList.toggle('dark-mode');
        if (isCheckedDarkMode) {
            localStorage.setItem('dark-mode', 'true');
        } else {
            localStorage.setItem('dark-mode', 'false');
        }
    }
}

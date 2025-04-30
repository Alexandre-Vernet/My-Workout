import { Injectable } from '@angular/core';
import { updatePreset } from '@primeng/themes';
import { presets } from './presets';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    loadTheme() {
        const presetName = localStorage.getItem('theme');
        if (presetName) {
            this.updateTheme(presets[presetName], presetName);
        } else {
            this.updateTheme(presets['cyan'], 'cyan');
        }
    }

    updateTheme(preset: string, presetName: string) {
        updatePreset(preset);
        localStorage.setItem('theme', presetName);
    }
}

import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from '../../../shared/theme/theme.service';
import { presets, PresetName } from '../../../shared/theme/presets';
import { ToggleSwitchComponent } from '../../../shared/toggle-switch/toggle-switch.component';

@Component({
    selector: 'app-change-theme',
    imports: [ToggleSwitchComponent],
    templateUrl: './change-theme.component.html',
    styleUrl: './change-theme.component.scss',
    standalone: true
})
export class ChangeThemeComponent implements OnInit {

    presets = presets;
    presetsArray = Object.entries(this.presets).map(([key, value]) => ({
        key,
        value
    }));

    selectedTheme: string | null = null;
    isCheckedDarkMode = false;

    private readonly themeService = inject(ThemeService);

    ngOnInit() {
        this.selectedTheme = localStorage.getItem('theme');
        this.isCheckedDarkMode = this.themeService.isDarkMode();
    }


    updatePreset(presetName: string) {
        const preset = this.presets[presetName as PresetName].preset;
        this.themeService.updateTheme(preset, presetName);
        this.selectedTheme = presetName;
    }

    toggleDarkMode(isCheckedDarkMode: boolean) {
        this.isCheckedDarkMode = isCheckedDarkMode;
        this.themeService.toggleDarkMode(isCheckedDarkMode);
    }
}

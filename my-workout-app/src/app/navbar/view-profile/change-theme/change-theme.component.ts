import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { ThemeService } from '../../../shared/theme/theme.service';
import { presets, PresetName } from '../../../shared/theme/presets';
import { ToggleSwitchComponent } from '../../../shared/toggle-switch/toggle-switch.component';
import { I18N } from '../../../shared/i18n/i18n';

@Component({
    selector: 'app-change-theme',
    imports: [ToggleSwitchComponent],
    templateUrl: './change-theme.component.html',
    styleUrl: './change-theme.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class ChangeThemeComponent {

    protected readonly i18n = I18N.viewProfile.changeTheme;

    presets = presets;
    presetsArray = Object.entries(this.presets).map(([key, value]) => ({
        key,
        value
    }));

    selectedTheme: string | null = null;
    isCheckedDarkMode = false;

    private readonly themeService = inject(ThemeService);

    constructor() {
        effect(() => {
            this.selectedTheme = localStorage.getItem('theme');
            this.isCheckedDarkMode = this.themeService.isDarkMode();
        });
    }


    protected updatePreset(presetName: string) {
        const preset = this.presets[presetName as PresetName].preset;
        this.themeService.updateTheme(preset, presetName);
        this.selectedTheme = presetName;
    }

    protected toggleDarkMode(isCheckedDarkMode: boolean) {
        this.isCheckedDarkMode = isCheckedDarkMode;
        this.themeService.toggleDarkMode(isCheckedDarkMode);
    }
}

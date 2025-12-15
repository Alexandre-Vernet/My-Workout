import { Component, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { ThemeService } from '../../../shared/theme/theme.service';
import { presets } from '../../../shared/theme/presets';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-change-theme',
    imports: [CommonModule, ToggleSwitch, FormsModule],
    templateUrl: './change-theme.component.html',
    styleUrl: './change-theme.component.scss',
    standalone: true
})
export class ChangeThemeComponent implements OnInit {

    @Output() isDarkMode = new Subject<boolean>();

    presets = presets;
    presetsArray = Object.entries(this.presets).map(([key, value]) => ({
        key,
        value
    }));

    selectedTheme: string;
    isCheckedDarkMode: boolean;

    constructor(
        private readonly themeService: ThemeService
    ) {
    }

    ngOnInit() {
        this.selectedTheme = localStorage.getItem('theme');
        this.isCheckedDarkMode = this.themeService.isDarkMode();
    }


    updatePreset(presetName: string) {
        const preset = this.presets[presetName].preset;
        this.themeService.updateTheme(preset, presetName);
    }

    toggleDarkMode() {
        this.themeService.toggleDarkMode(this.isCheckedDarkMode);
        this.isDarkMode.next(this.isCheckedDarkMode);
    }
}

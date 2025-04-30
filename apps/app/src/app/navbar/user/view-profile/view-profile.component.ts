import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatLabel } from 'primeng/floatlabel';
import { AuthService } from '../../../auth/auth.service';
import { take } from 'rxjs';
import { InputText } from 'primeng/inputtext';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ThemeService } from '../../../theme/theme.service';
import { presets } from '../../../theme/presets';
import { DropdownModule } from 'primeng/dropdown';
import { Select } from 'primeng/select';
import { ToggleSwitch } from 'primeng/toggleswitch';

@Component({
    selector: 'app-view-profile',
    imports: [CommonModule, FloatLabel, InputText, ReactiveFormsModule, DropdownModule, FormsModule, Select, ToggleSwitch],
    templateUrl: './view-profile.component.html',
    styleUrl: './view-profile.component.scss',
    standalone: true
})
export class ViewProfileComponent implements OnInit {

    formControlEmail = new FormControl('', [Validators.required, Validators.email, Validators.maxLength(255)]);
    formControlPassword = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]);

    presets = presets;
    selectedTheme: string;

    isCheckedDarkMode: boolean;

    constructor(
        private readonly authService: AuthService,
        private readonly themeService: ThemeService
    ) {
    }

    themeOptions = Object.keys(presets).map(key => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value: key
    }));

    ngOnInit() {
        this.selectedTheme = localStorage.getItem('theme');
        this.isCheckedDarkMode = localStorage.getItem('dark-mode') === 'true';

        this.authService.user$
            .pipe(take(1))
            .subscribe(user => {
                console.log(user);
                this.formControlEmail.setValue(user.email);
            });
    }

    updatePreset(presetName: string) {
        const preset = this.presets[presetName];
        this.themeService.updateTheme(preset, presetName);
    }

    toggleDarkMode() {
        this.themeService.toggleDarkMode(this.isCheckedDarkMode);
    }
}

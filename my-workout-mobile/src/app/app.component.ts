import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { NavbarComponent } from './navbar/navbar.component';
import { NgClass } from "@angular/common";
import { NavigationEnd, Router } from "@angular/router";
import { PrimeNG } from "primeng/config";
import { ThemeService } from "./theme/theme.service";
import { DeviceDetectionService } from "./services/device-detection.service";
import { filter } from "rxjs";
import { AlertComponent } from "./alert/alert.component";
import { Capacitor } from "@capacitor/core";

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    imports: [
        IonRouterOutlet,
        IonApp,
        NavbarComponent,
        NgClass,
        AlertComponent
    ],
    styleUrls: ['app.component.scss']

})
export class AppComponent implements OnInit {
    constructor(
        private router: Router,
        private primeng: PrimeNG,
        private readonly themeService: ThemeService,
        private readonly deviceDetection: DeviceDetectionService
    ) {
    }

    hideNavbar = false;
    isIphone: boolean = false;
    isDesktop: boolean = false;

    ngOnInit() {
        this.primeng.ripple.set(true);
        this.themeService.loadTheme();
        this.themeService.loadDarkMode();

        this.isIphone = this.deviceDetection.isIphone();

        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
            this.hideNavbar = event.url.includes('auth') || event.url.includes('desktop');
        });


        if (this.deviceDetection.isDesktop()) {
            this.isDesktop = true;
            this.router.navigate(['desktop']);
        }


        const platform = Capacitor.getPlatform();

        if (platform === 'android') {
            document.body.classList.add('android-app');
        }
    }
}

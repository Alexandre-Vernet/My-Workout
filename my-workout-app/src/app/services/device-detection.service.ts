import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DeviceDetectionService {

    isIphone() {
        return /iPhone/.test(navigator.userAgent) &&
            navigator.maxTouchPoints > 1 &&
            typeof window !== 'undefined' &&
            !window.matchMedia('(pointer: fine)').matches;
    }
}

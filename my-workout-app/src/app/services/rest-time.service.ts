import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { RestTimeInfo } from "../../interfaces/RestTimeInfo";

export const DEFAULT_VALUE_REST_TIME = '00:00:00';

@Injectable({
    providedIn: 'root',
})
export class RestTimeService {

    readonly DEFAULT_VALUE_REST_TIME = DEFAULT_VALUE_REST_TIME;
    private restTime = new BehaviorSubject(this.DEFAULT_VALUE_REST_TIME);
    restTime$ = this.restTime.asObservable();

    timer = {
        startTime: 0,
        minutes: 0,
        seconds: 0,
        centiseconds: 0,
        interval: null
    };

    private restTimeInfo: RestTimeInfo;

    saveRestTimeInfo(restTimeInfo: RestTimeInfo) {
        this.restTimeInfo = restTimeInfo;
    }

    getRestTimeInfo() {
        return this.restTimeInfo;
    }

    startTimer() {
        this.timer.startTime = performance.now();
        this.timer.interval = setInterval(() => {
            const elapsed = performance.now() - this.timer.startTime;

            const centiseconds = Math.floor(elapsed / 10) % 100;
            const seconds = Math.floor(elapsed / 1000) % 60;
            const minutes = Math.floor(elapsed / 60000);

            this.timer.centiseconds = centiseconds;
            this.timer.seconds = seconds;
            this.timer.minutes = minutes;

            this.restTime.next(this.formatTimer(this.timer.minutes, this.timer.seconds, this.timer.centiseconds))
        }, 10);
    }

    stopTimer() {
        clearInterval(this.timer.interval);
        this.timer.interval = null;
        this.timer = {
            ...this.timer,
            minutes: 0,
            seconds: 0,
            centiseconds: 0
        };

        this.restTime.next(this.DEFAULT_VALUE_REST_TIME);
    }

    /*
        Format : MM:SS:CS
        Exemple : 02:05:72
     */
    private formatTimer(minutes: number, seconds: number, centiseconds: number) {
        return `${ minutes.toString().padStart(2, '0') }:${ seconds.toString().padStart(2, '0') }:${ centiseconds.toString().padStart(2, '0') }`;
    }
}

import { Injectable, signal } from '@angular/core';
import { RestTimeInfo } from "../../interfaces/RestTimeInfo";
import { RestTimeValue } from "../../interfaces/RestTimeValue";

export const DEFAULT_VALUE_REST_TIME: RestTimeValue = { minutes: 0, seconds: 0, centiseconds: 0 };

@Injectable({
    providedIn: 'root',
})
export class RestTimeService {

    readonly DEFAULT_VALUE_REST_TIME = DEFAULT_VALUE_REST_TIME;
    readonly restTime = signal<RestTimeValue>(this.DEFAULT_VALUE_REST_TIME);

    private readonly timer = {
        startTime: 0,
        interval: null as ReturnType<typeof setInterval> | null
    };

    private restTimeInfo: RestTimeInfo | null = null;

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

            this.restTime.set({
                minutes: Math.floor(elapsed / 60000),
                seconds: Math.floor(elapsed / 1000) % 60,
                centiseconds: Math.floor(elapsed / 10) % 100
            });
        }, 10);
    }

    stopTimer() {
        clearInterval(this.timer.interval ?? undefined);
        this.timer.interval = null;

        this.restTime.set(this.DEFAULT_VALUE_REST_TIME);
    }
}

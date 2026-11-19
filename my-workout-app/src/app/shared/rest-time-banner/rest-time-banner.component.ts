import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DEFAULT_VALUE_REST_TIME, RestTimeService } from "../../services/rest-time.service";
import { Message } from "primeng/message";
import { NavigationEnd, Router } from "@angular/router";
import { filter, map } from "rxjs";
import { RestTimePipe } from "../pipes/rest-time.pipe";

@Component({
    selector: 'app-rest-time-banner',
    imports: [
        Message,
        RestTimePipe
    ],
    templateUrl: './rest-time-banner.component.html',
    styleUrl: './rest-time-banner.component.scss',
})
export class RestTimeBannerComponent {
    private readonly router = inject(Router);
    protected readonly restTimeService = inject(RestTimeService);

    protected readonly DEFAULT_VALUE_REST_TIME = DEFAULT_VALUE_REST_TIME;

    protected readonly showBanner = toSignal(
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map((event: NavigationEnd) => !event.url.includes('workout-session'))
        ),
        { initialValue: false }
    );

    protected stopTimer() {
        this.restTimeService.stopTimer();
    }

    protected redirectToWorkout() {
        const info = this.restTimeService.getRestTimeInfo();
        if (info) {
            this.router.navigate(['workout', 'workout-session', info.muscleGroup], {
                queryParams: {
                    tab: info.tab
                }
            })
        }
    }
}

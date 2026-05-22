import { Component, DestroyRef, OnInit } from '@angular/core';
import { DEFAULT_VALUE_REST_TIME, RestTimeService } from "../../services/rest-time.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Message } from "primeng/message";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";

@Component({
    selector: 'app-rest-time-banner',
    imports: [
        Message
    ],
    templateUrl: './rest-time-banner.component.html',
    styleUrl: './rest-time-banner.component.scss',
})
export class RestTimeBannerComponent implements OnInit {

    protected readonly DEFAULT_VALUE_REST_TIME = DEFAULT_VALUE_REST_TIME;

    showBanner = false;
    restTime = '';


    constructor(
        private readonly router: Router,
        private readonly restTimeService: RestTimeService,
        private readonly destroyRef: DestroyRef,
    ) {
    }

    ngOnInit() {
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((event: NavigationEnd) => this.showBanner = !event.url.includes('workout-session'));

        this.restTimeService.restTime$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(restTime => this.restTime = restTime);
    }

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

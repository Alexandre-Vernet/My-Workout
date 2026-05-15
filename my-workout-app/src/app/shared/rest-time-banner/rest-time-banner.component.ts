import { Component, DestroyRef, OnInit } from '@angular/core';
import { RestTimeService } from "../../services/rest-time.service";
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

    showBanner = false;
    restTime = '';


    constructor(
        private readonly router: Router,
        private readonly restTimeService: RestTimeService,
        private readonly destroyRef: DestroyRef
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
}

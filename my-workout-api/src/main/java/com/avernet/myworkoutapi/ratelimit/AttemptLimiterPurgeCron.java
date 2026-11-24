package com.avernet.myworkoutapi.ratelimit;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

// Without this, every distinct email ever tried would stay in memory forever.
@Component
@RequiredArgsConstructor
public class AttemptLimiterPurgeCron {

    private final List<AttemptLimiter> attemptLimiters;

    @Scheduled(fixedRateString = "PT15M")
    public void purgeExpired() {
        attemptLimiters.forEach(AttemptLimiter::purgeExpired);
    }
}

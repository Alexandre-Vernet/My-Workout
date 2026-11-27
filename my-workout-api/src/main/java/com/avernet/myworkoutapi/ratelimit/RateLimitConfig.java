package com.avernet.myworkoutapi.ratelimit;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Clock;
import java.time.Duration;

@Configuration
public class RateLimitConfig {

    // A legitimate user mistyping their password rarely needs more than a handful of tries,
    // while a short lock keeps the cost low for the account owner if someone else is the one
    // triggering it (the counter is per email, so it can be triggered by anyone).
    private static final int MAX_FAILED_LOGIN_ATTEMPTS = 5;
    private static final Duration LOGIN_LOCK_WINDOW = Duration.ofMinutes(15);

    private static final int MAX_PASSWORD_RESET_REQUESTS = 3;
    private static final Duration PASSWORD_RESET_WINDOW = Duration.ofMinutes(15);

    @Bean
    Clock clock() {
        return Clock.systemDefaultZone();
    }

    @Bean
    AttemptLimiter loginAttemptLimiter(Clock clock) {
        return new AttemptLimiter(MAX_FAILED_LOGIN_ATTEMPTS, LOGIN_LOCK_WINDOW, clock);
    }

    @Bean
    AttemptLimiter passwordResetAttemptLimiter(Clock clock) {
        return new AttemptLimiter(MAX_PASSWORD_RESET_REQUESTS, PASSWORD_RESET_WINDOW, clock);
    }
}

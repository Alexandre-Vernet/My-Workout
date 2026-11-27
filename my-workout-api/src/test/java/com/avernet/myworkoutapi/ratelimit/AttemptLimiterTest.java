package com.avernet.myworkoutapi.ratelimit;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AttemptLimiterTest {

    private static final Duration WINDOW = Duration.ofMinutes(15);

    private MutableClock clock;
    private AttemptLimiter limiter;

    @BeforeEach
    void setUp() {
        clock = new MutableClock(Instant.parse("2026-11-22T10:00:00Z"));
        limiter = new AttemptLimiter(3, WINDOW, clock);
    }

    @Test
    void shouldNotBlockUnknownKey() {
        assertFalse(limiter.isBlocked("user@gmail.com"));
    }

    @Test
    void shouldBlockOnceMaxAttemptsReached() {
        limiter.recordAttempt("user@gmail.com");
        limiter.recordAttempt("user@gmail.com");
        assertFalse(limiter.isBlocked("user@gmail.com"));

        limiter.recordAttempt("user@gmail.com");
        assertTrue(limiter.isBlocked("user@gmail.com"));
    }

    @Test
    void shouldUnblockOnceWindowIsOver() {
        recordAttempts("user@gmail.com", 3);

        clock.advance(WINDOW.minusSeconds(1));
        assertTrue(limiter.isBlocked("user@gmail.com"));

        clock.advance(Duration.ofSeconds(1));
        assertFalse(limiter.isBlocked("user@gmail.com"));
    }

    @Test
    void shouldStartNewWindowAfterExpiration() {
        recordAttempts("user@gmail.com", 3);
        clock.advance(WINDOW);

        limiter.recordAttempt("user@gmail.com");
        assertFalse(limiter.isBlocked("user@gmail.com"));
    }

    @Test
    void shouldTreatKeysCaseAndSpaceInsensitively() {
        recordAttempts(" User@Gmail.com ", 3);

        assertTrue(limiter.isBlocked("user@gmail.com"));
    }

    @Test
    void shouldIsolateKeys() {
        recordAttempts("user@gmail.com", 3);

        assertFalse(limiter.isBlocked("other@gmail.com"));
    }

    @Test
    void shouldClearKeyOnReset() {
        recordAttempts("user@gmail.com", 3);

        limiter.reset("user@gmail.com");

        assertFalse(limiter.isBlocked("user@gmail.com"));
    }

    @Test
    void shouldAcquireUntilLimitThenRefuse() {
        assertTrue(limiter.tryAcquire("user@gmail.com"));
        assertTrue(limiter.tryAcquire("user@gmail.com"));
        assertTrue(limiter.tryAcquire("user@gmail.com"));
        assertFalse(limiter.tryAcquire("user@gmail.com"));

        clock.advance(WINDOW);
        assertTrue(limiter.tryAcquire("user@gmail.com"));
    }

    @Test
    void shouldHandleNullKey() {
        recordAttempts(null, 3);

        assertTrue(limiter.isBlocked(null));
    }

    @Test
    void shouldPurgeOnlyExpiredWindows() {
        limiter.recordAttempt("old@gmail.com");
        clock.advance(Duration.ofMinutes(10));
        limiter.recordAttempt("recent@gmail.com");
        clock.advance(Duration.ofMinutes(5));

        limiter.purgeExpired();

        assertEquals(1, limiter.trackedKeys());
    }

    private void recordAttempts(String key, int count) {
        for (int i = 0; i < count; i++) {
            limiter.recordAttempt(key);
        }
    }

    private static final class MutableClock extends Clock {
        private Instant instant;

        private MutableClock(Instant instant) {
            this.instant = instant;
        }

        void advance(Duration duration) {
            instant = instant.plus(duration);
        }

        @Override
        public ZoneId getZone() {
            return ZoneOffset.UTC;
        }

        @Override
        public Clock withZone(ZoneId zone) {
            return this;
        }

        @Override
        public Instant instant() {
            return instant;
        }
    }
}

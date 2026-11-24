package com.avernet.myworkoutapi.ratelimit;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Fixed-window attempt counter, keyed by a business identifier (an email) rather than by
 * client IP: the API sits behind a reverse proxy, so the remote address would be the same
 * for every user, and X-Forwarded-For can be forged by the client.
 * In-memory on purpose: the API runs as a single instance, so a distributed store would be
 * pure overhead. A restart simply resets the counters.
 */
public class AttemptLimiter {

    private final int maxAttempts;
    private final Duration window;
    private final Clock clock;
    private final Map<String, Window> windowsByKey = new ConcurrentHashMap<>();

    private record Window(Instant start, int attempts) {
    }

    public AttemptLimiter(int maxAttempts, Duration window, Clock clock) {
        this.maxAttempts = maxAttempts;
        this.window = window;
        this.clock = clock;
    }

    public boolean isBlocked(String key) {
        Window current = windowsByKey.get(normalize(key));
        return current != null && !isExpired(current) && current.attempts() >= maxAttempts;
    }

    public void recordAttempt(String key) {
        windowsByKey.compute(normalize(key), (k, current) ->
            current == null || isExpired(current)
                ? new Window(clock.instant(), 1)
                : new Window(current.start(), current.attempts() + 1));
    }

    /**
     * Records the attempt only if the key is not already blocked.
     *
     * @return {@code true} if the attempt is allowed
     */
    public boolean tryAcquire(String key) {
        String normalizedKey = normalize(key);
        boolean[] allowed = {false};
        windowsByKey.compute(normalizedKey, (k, current) -> {
            if (current == null || isExpired(current)) {
                allowed[0] = true;
                return new Window(clock.instant(), 1);
            }
            if (current.attempts() >= maxAttempts) {
                return current;
            }
            allowed[0] = true;
            return new Window(current.start(), current.attempts() + 1);
        });
        return allowed[0];
    }

    public void reset(String key) {
        windowsByKey.remove(normalize(key));
    }

    public void purgeExpired() {
        windowsByKey.values().removeIf(this::isExpired);
    }

    int trackedKeys() {
        return windowsByKey.size();
    }

    private boolean isExpired(Window current) {
        return !clock.instant().isBefore(current.start().plus(window));
    }

    private static String normalize(String key) {
        return key == null ? "" : key.trim().toLowerCase(Locale.ROOT);
    }
}

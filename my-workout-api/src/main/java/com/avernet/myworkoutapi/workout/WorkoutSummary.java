package com.avernet.myworkoutapi.workout;

import java.time.LocalDateTime;

public record WorkoutSummary(Long id, LocalDateTime date, Integer duration) {
}

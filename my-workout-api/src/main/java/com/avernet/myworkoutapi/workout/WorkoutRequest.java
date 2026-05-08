package com.avernet.myworkoutapi.workout;

import com.avernet.myworkoutapi.history.History;

public record WorkoutRequest(
    Workout workout,
    History history
) {
}

package com.avernet.myworkoutapi.history;

import com.avernet.myworkoutapi.workout.Workout;
import com.avernet.myworkoutapi.exercise.Exercise;

public record History(
    Long id,
    Float weight,
    Short reps,
    Workout workout,
    Exercise exercise
) {
}

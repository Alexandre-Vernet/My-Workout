package com.avernet.my_workout_api.History;

import com.avernet.my_workout_api.Workout.Workout;
import com.avernet.my_workout_api.exercise.Exercise;

public record History(
    Long id,
    Exercise exercise,
    Float weight,
    Short reps,
    Workout workout
) {
}

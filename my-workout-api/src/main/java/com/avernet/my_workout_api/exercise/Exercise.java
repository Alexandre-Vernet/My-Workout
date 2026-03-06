package com.avernet.my_workout_api.exercise;

public record Exercise(
    Long id,
    String name,
    String description,
    Boolean isSmartWorkout
) {
}

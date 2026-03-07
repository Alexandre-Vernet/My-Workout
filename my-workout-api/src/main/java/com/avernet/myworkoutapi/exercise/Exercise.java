package com.avernet.myworkoutapi.exercise;

public record Exercise(
    Long id,
    String name,
    String description,
    Boolean isSmartWorkout
) {
}

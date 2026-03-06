package com.avernet.my_workout_api.Workout;

import com.avernet.my_workout_api.MuscleGroup.MuscleGroup;

import java.time.LocalDate;

public record Workout(
    Long id,
    MuscleGroup muscleGroup,
    LocalDate date,
    Integer duration
) {
}

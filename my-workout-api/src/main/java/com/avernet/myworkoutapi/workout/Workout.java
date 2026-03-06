package com.avernet.myworkoutapi.workout;

import com.avernet.myworkoutapi.musclegroup.MuscleGroup;

import java.time.LocalDate;

public record Workout(
    Long id,
    MuscleGroup muscleGroup,
    LocalDate date,
    Integer duration
) {
}

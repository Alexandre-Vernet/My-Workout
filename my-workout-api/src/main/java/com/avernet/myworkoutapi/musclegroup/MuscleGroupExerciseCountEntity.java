package com.avernet.myworkoutapi.musclegroup;

import java.time.LocalDate;

public record MuscleGroupExerciseCountEntity(
    MuscleGroupEntity muscleGroup,
    Long exerciseCount,
    LocalDate lastWorkout
) {
}

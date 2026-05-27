package com.avernet.myworkoutapi.musclegroup;

import java.time.LocalDateTime;

public record MuscleGroupExerciseCountEntity(
    MuscleGroupEntity muscleGroup,
    Long exerciseCount,
    LocalDateTime lastWorkout
) {
}

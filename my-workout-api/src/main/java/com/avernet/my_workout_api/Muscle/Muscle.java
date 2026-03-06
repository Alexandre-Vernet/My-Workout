package com.avernet.my_workout_api.Muscle;

import com.avernet.my_workout_api.MuscleGroup.MuscleGroup;

public record Muscle(
    Long id,
    String name,
    MuscleGroup muscleGroup
) {
}

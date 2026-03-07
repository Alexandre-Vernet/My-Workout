package com.avernet.myworkoutapi.muscle;

import com.avernet.myworkoutapi.musclegroup.MuscleGroup;

public record Muscle(
    Long id,
    String name,
    MuscleGroup muscleGroup
) {
}

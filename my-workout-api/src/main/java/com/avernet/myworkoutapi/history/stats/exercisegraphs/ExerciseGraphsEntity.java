package com.avernet.myworkoutapi.history.stats.exercisegraphs;

import com.avernet.myworkoutapi.exercise.ExerciseEntity;

public record ExerciseGraphsEntity(
    ExerciseEntity exercise,
    Double totalWeight,
    Float maxWeight,
    Long totalReps
) {
}

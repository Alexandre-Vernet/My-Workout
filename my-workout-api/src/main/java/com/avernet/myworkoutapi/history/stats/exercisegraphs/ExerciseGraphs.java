package com.avernet.myworkoutapi.history.stats.exercisegraphs;

import com.avernet.myworkoutapi.exercise.Exercise;
import com.avernet.myworkoutapi.history.stats.HistoryPoint;

import java.util.List;

public record ExerciseGraphs(
    Exercise exercise,
    List<HistoryPoint> historyPoints,
    Double totalWeight,
    Float maxWeight,
    Long totalReps
) {
}

package com.avernet.myworkoutapi.history.stats;

import com.avernet.myworkoutapi.exercise.Exercise;

import java.util.List;

public record UserExercisesCountTotalWorkout(
    Long countTotalDaysWorkout,
    List<Exercise> exercises
){}

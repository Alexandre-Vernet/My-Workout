package com.avernet.myworkoutapi.exercise;

import com.avernet.myworkoutapi.exercisemuscle.ExerciseMuscle;

import java.util.List;

public record Exercise(
    Long id,
    String name,
    String description,
    Boolean isSmartWorkout,
    List<ExerciseMuscle> exerciseMuscleList
) {
}

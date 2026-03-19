package com.avernet.myworkoutapi.exercise;

public record ExerciseAddedToWorkoutEntity(ExerciseEntity exercise, Boolean addedToWorkout, Integer order) {
}

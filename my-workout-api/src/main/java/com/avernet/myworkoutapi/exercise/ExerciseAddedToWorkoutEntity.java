package com.avernet.myworkoutapi.exercise;

import com.avernet.myworkoutapi.muscle.MuscleEntity;

import java.util.List;

public record ExerciseAddedToWorkoutEntity(ExerciseEntity exercise, List<MuscleEntity> muscles, Boolean addedToWorkout, Integer order) {
}

package com.avernet.myworkoutapi.exercise;

import com.avernet.myworkoutapi.muscle.Muscle;
import com.avernet.myworkoutapi.musclegroup.MuscleGroup;

import java.util.List;

public record MuscleGroupExercises(MuscleGroup muscleGroup, List<ExerciseAddedToWorkout> exerciseAddedToWorkouts, List<Muscle> muscles) {
}

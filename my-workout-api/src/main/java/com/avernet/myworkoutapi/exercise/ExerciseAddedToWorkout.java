package com.avernet.myworkoutapi.exercise;

import com.avernet.myworkoutapi.muscle.Muscle;

import java.util.List;

public record ExerciseAddedToWorkout(Exercise exercise, List<Muscle> muscles, Boolean addedToWorkout, Integer order) {
}

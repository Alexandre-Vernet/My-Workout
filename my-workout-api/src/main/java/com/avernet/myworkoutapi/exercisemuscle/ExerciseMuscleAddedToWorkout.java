package com.avernet.myworkoutapi.exercisemuscle;

import com.avernet.myworkoutapi.exercise.Exercise;
import com.avernet.myworkoutapi.muscle.Muscle;

import java.util.List;

public record ExerciseMuscleAddedToWorkout(Exercise exercise, List<Muscle> muscles, Boolean addedToWorkout) {
}

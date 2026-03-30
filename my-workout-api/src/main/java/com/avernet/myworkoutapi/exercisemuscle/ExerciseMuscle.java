package com.avernet.myworkoutapi.exercisemuscle;

import com.avernet.myworkoutapi.exercise.Exercise;
import com.avernet.myworkoutapi.muscle.Muscle;

import java.util.List;

public record ExerciseMuscle(Exercise exercise, List<Muscle> muscles) {
}

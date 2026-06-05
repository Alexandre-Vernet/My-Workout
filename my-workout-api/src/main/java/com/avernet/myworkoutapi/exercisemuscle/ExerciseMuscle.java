package com.avernet.myworkoutapi.exercisemuscle;

import com.avernet.myworkoutapi.exercise.Exercise;
import com.avernet.myworkoutapi.muscle.Muscle;
import jakarta.validation.Valid;

import java.util.List;

public record ExerciseMuscle(@Valid Exercise exercise, List<Muscle> muscles) {
}

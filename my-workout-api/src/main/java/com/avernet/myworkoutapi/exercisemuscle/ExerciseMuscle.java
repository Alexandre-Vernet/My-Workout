package com.avernet.myworkoutapi.exercisemuscle;

import com.avernet.myworkoutapi.muscle.Muscle;
import com.avernet.myworkoutapi.exercise.Exercise;

public record ExerciseMuscle(
    Long id,
    Exercise exercise,
    Muscle muscle
) {
}

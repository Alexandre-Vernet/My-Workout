package com.avernet.my_workout_api.ExerciseMuscle;

import com.avernet.my_workout_api.Muscle.Muscle;
import com.avernet.my_workout_api.exercise.Exercise;

public record ExerciseMuscle(
    Long id,
    Exercise exercise,
    Muscle muscle
) {
}

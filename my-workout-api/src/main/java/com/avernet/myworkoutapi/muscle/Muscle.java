package com.avernet.myworkoutapi.muscle;

import com.avernet.myworkoutapi.exercisemuscle.ExerciseMuscle;
import com.avernet.myworkoutapi.musclegroup.MuscleGroup;

import java.util.List;

public record Muscle(
    Long id,
    String name,
    MuscleGroup muscleGroup,
    List<ExerciseMuscle> exerciseMuscleList
) {
}

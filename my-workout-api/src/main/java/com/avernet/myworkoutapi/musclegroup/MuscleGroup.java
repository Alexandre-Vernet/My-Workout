package com.avernet.myworkoutapi.musclegroup;

import com.avernet.myworkoutapi.muscle.Muscle;
import com.avernet.myworkoutapi.workout.Workout;

import java.util.List;

public record MuscleGroup(
    Long id,
    String name,
    List<Workout> workoutList,
    List<Muscle> muscleList
) {
}

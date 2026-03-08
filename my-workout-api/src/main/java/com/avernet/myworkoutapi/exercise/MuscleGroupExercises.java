package com.avernet.myworkoutapi.exercise;

import com.avernet.myworkoutapi.musclegroup.MuscleGroup;

import java.util.List;

public record MuscleGroupExercises(MuscleGroup muscleGroup, List<Exercise> exerciseList) {
}

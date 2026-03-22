package com.avernet.myworkoutapi.exercise;

import com.avernet.myworkoutapi.muscle.Muscle;

import java.util.List;

public record ExerciseMuscle(Exercise exercise, List<Muscle> muscles) {
}

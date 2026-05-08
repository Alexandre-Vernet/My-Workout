package com.avernet.myworkoutapi.musclegroup;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MuscleGroupExerciseCount {
    MuscleGroup muscleGroup;
    Long exerciseCount;
    LocalDateTime lastWorkout;
}

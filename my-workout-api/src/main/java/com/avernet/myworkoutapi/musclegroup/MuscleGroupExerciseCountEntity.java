package com.avernet.myworkoutapi.musclegroup;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class MuscleGroupExerciseCountEntity {
    MuscleGroupEntity muscleGroup;
    Long exerciseCount;
    LocalDate lastWorkout;
    boolean recommended;

    public MuscleGroupExerciseCountEntity(MuscleGroupEntity muscleGroup, Long exerciseCount, LocalDate lastWorkout) {
        this.muscleGroup = muscleGroup;
        this.exerciseCount = exerciseCount;
        this.lastWorkout = lastWorkout;
    }
}

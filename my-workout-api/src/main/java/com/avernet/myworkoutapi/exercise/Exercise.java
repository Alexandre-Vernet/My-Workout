package com.avernet.myworkoutapi.exercise;

import com.avernet.myworkoutapi.exercisemuscle.ExerciseMuscle;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Exercise {
    Long id;
    String name;
    String description;
    boolean isSmartWorkout;
    List<ExerciseMuscle> exerciseMuscleList;
}

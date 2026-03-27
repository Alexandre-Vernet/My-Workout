package com.avernet.myworkoutapi.history;

import com.avernet.myworkoutapi.exercise.Exercise;
import com.avernet.myworkoutapi.workout.Workout;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class History {
    Long id;
    Float weight;
    Short reps;
    Workout workout;
    Exercise exercise;
}

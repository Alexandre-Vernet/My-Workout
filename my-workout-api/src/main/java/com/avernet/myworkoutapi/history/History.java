package com.avernet.myworkoutapi.history;

import com.avernet.myworkoutapi.exercise.Exercise;
import com.avernet.myworkoutapi.workout.Workout;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class History {
    Long id;
    Float weight;
    Short reps;
    Boolean unilateral;
    Workout workout;
    Exercise exercise;
}

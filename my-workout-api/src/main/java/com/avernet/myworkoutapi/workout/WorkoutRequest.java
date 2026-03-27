package com.avernet.myworkoutapi.workout;

import com.avernet.myworkoutapi.history.History;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WorkoutRequest {
    Workout workout;
    History history;
}

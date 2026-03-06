package com.avernet.myworkoutapi.workout;

import com.avernet.myworkoutapi.history.History;
import com.avernet.myworkoutapi.musclegroup.MuscleGroup;
import com.avernet.myworkoutapi.user.User;

import java.time.LocalDate;
import java.util.List;

public record Workout(
    Long id,
    LocalDate date,
    Integer duration,
    User user,
    MuscleGroup muscleGroup,
    List<History> historyList
) {
}

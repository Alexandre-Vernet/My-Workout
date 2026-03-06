package com.avernet.myworkoutapi.user;

import com.avernet.myworkoutapi.userexercise.UserExercise;
import com.avernet.myworkoutapi.workout.Workout;

import java.time.LocalDate;
import java.util.List;

public record User(
    Long id,
    String email,
    String password,
    LocalDate createdAt,
    LocalDate updatedAt,
    Boolean isAdmin,
    List<Workout> workoutList,
    List<UserExercise> userExerciseList
) {
}

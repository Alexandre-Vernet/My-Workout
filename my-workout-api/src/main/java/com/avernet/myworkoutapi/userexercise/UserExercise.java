package com.avernet.myworkoutapi.userexercise;

import com.avernet.myworkoutapi.exercise.Exercise;
import com.avernet.myworkoutapi.user.User;

public record UserExercise(
    Long id,
    Integer order,
    User user,
    Exercise exercise
) {
}

package com.avernet.myworkoutapi.userexercise;

import com.avernet.myworkoutapi.exercise.Exercise;
import com.avernet.myworkoutapi.user.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserExercise {
    Long id;
    Integer order;
    User user;
    Exercise exercise;
}

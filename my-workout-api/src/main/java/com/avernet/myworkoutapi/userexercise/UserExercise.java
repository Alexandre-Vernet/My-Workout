package com.avernet.myworkoutapi.userexercise;

import com.avernet.myworkoutapi.exercise.Exercise;
import com.avernet.myworkoutapi.user.User;
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
public class UserExercise {
    Long id;
    Integer order;
    User user;
    Exercise exercise;
}

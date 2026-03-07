package com.avernet.myworkoutapi.workout;

import com.avernet.myworkoutapi.musclegroup.MuscleGroup;
import com.avernet.myworkoutapi.user.User;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class Workout {
    Long id;
    LocalDate date;
    Integer duration;
    User user;
    MuscleGroup muscleGroup;
}

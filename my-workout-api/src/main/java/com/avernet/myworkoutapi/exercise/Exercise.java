package com.avernet.myworkoutapi.exercise;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Exercise {
    Long id;
    String name;
    String description;
    boolean isSmartWorkout;
}

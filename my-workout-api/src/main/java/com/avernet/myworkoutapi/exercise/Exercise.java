package com.avernet.myworkoutapi.exercise;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
public class Exercise {
    Long id;
    String name;
    String description;
    boolean isSmartWorkout;
}

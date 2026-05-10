package com.avernet.myworkoutapi.musclegroup;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum MuscleGroupEnum {
    PECTORAUX(1), TRICEPS(2), JAMBES(3), EPAULES(4), DOS(5), BICEPS(6), ABDOMINAUX(7), CARDIO(8);

    private final int id;
}

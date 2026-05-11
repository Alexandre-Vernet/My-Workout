package com.avernet.myworkoutapi;

import com.avernet.myworkoutapi.musclegroup.MuscleGroupEnum;
import org.junit.jupiter.api.Test;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ActiveProfiles("test")
public class MuscleGroupEnumTest {

    @Test
    void muscleGroupEnum_shouldReturnAllMuscleGroupWithTheresId() {
        MuscleGroupEnum[] muscleGroupEnum = MuscleGroupEnum.values();

        for (int i = 0; i < muscleGroupEnum.length; i++) {
            assertEquals(i + 1, muscleGroupEnum[i].getId());
        }
    }
}

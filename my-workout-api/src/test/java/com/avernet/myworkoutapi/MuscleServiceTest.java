package com.avernet.myworkoutapi;

import com.avernet.myworkoutapi.muscle.MuscleDropdown;
import com.avernet.myworkoutapi.muscle.MuscleService;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
@Sql(scripts = "/data.sql")
public class MuscleServiceTest {

    @Resource
    MuscleService service;


    @Test
    void shouldFindMuscles() {
        List<MuscleDropdown> muscleDropdownList = service.findAllMuscle();
        assertNotNull(muscleDropdownList);
        assertFalse(muscleDropdownList.isEmpty());
    }
}

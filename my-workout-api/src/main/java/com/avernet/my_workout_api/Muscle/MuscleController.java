package com.avernet.my_workout_api.Muscle;

import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MuscleController {

    @Resource
    MuscleService muscleService;
}

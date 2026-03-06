package com.avernet.my_workout_api.ExerciseMuscle;

import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ExerciseMuscleController {

    @Resource
    ExerciseMuscleService exerciseMuscleService;
}

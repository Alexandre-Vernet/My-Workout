package com.avernet.myworkoutapi.workout;

import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WorkoutController {

    @Resource
    WorkoutService workoutService;
}

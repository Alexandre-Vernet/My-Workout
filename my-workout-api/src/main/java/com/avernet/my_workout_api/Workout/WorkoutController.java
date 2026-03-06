package com.avernet.my_workout_api.Workout;

import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WorkoutController {

    @Resource
    WorkoutService workoutService;
}

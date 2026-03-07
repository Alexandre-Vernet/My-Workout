package com.avernet.myworkoutapi.workout;

import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/workout")
public class WorkoutController {

    @Resource
    WorkoutService workoutService;

    @PostMapping()
    Workout create(@RequestBody Workout workout) {
        return workoutService.createWorkout(workout);
    }
}

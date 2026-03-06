package com.avernet.my_workout_api.MuscleGroup;

import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MuscleGroupController {

    @Resource
    MuscleGroupService muscleGroupService;
}

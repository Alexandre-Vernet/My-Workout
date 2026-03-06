package com.avernet.myworkoutapi.musclegroup;

import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MuscleGroupController {

    @Resource
    MuscleGroupService muscleGroupService;
}

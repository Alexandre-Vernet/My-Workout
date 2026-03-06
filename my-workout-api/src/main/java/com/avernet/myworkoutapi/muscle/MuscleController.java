package com.avernet.myworkoutapi.muscle;

import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MuscleController {

    @Resource
    MuscleService muscleService;
}

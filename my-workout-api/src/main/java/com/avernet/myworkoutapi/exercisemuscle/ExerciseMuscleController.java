package com.avernet.myworkoutapi.exercisemuscle;

import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ExerciseMuscleController {

    @Resource
    ExerciseMuscleService exerciseMuscleService;
}

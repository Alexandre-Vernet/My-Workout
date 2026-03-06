package com.avernet.myworkoutapi.userexercise;

import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserExerciseController {

    @Resource
    UserExerciseService userExerciseService;
}

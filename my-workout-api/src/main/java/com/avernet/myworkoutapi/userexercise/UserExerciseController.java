package com.avernet.myworkoutapi.userexercise;

import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("user-exercise")
public class UserExerciseController {

    @Resource
    UserExerciseService userExerciseService;

    @PostMapping
    UserExercise create(@RequestBody UserExercise userExercise) {
        return userExerciseService.create(userExercise);
    }
}

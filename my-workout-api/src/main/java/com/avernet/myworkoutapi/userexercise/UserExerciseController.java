package com.avernet.myworkoutapi.userexercise;

import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("user-exercise")
public class UserExerciseController {

    @Resource
    UserExerciseService userExerciseService;

    @PostMapping
    UserExercise create(@RequestBody UserExercise userExercise) {
        return userExerciseService.create(userExercise);
    }

    @PatchMapping()
    void updateOrderExercises(@RequestBody List<UserExercise> userExerciseList) {
        userExerciseService.updateOrderExercises(userExerciseList);
    }
}

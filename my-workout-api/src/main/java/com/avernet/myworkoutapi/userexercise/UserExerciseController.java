package com.avernet.myworkoutapi.userexercise;

import com.avernet.myworkoutapi.exercise.Exercise;
import com.avernet.myworkoutapi.user.UserEntity;
import jakarta.annotation.Resource;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    UserExercise createOrDelete(@AuthenticationPrincipal UserEntity userEntity,  @RequestBody Exercise exercise) {
        return userExerciseService.createOrDelete(userEntity, exercise);
    }

    @PatchMapping()
    void updateOrderExercises(@AuthenticationPrincipal UserEntity userEntity, @RequestBody List<UserExercise> userExerciseList) {
        userExerciseService.updateOrderExercises(userEntity, userExerciseList);
    }
}

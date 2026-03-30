package com.avernet.myworkoutapi.exercise;

import com.avernet.myworkoutapi.exercisemuscle.ExerciseMuscle;
import com.avernet.myworkoutapi.user.UserEntity;
import jakarta.annotation.Resource;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("exercises")
public class ExerciseController {

    @Resource
    ExerciseService exerciseService;

    @GetMapping("find-all-exercises-by-muscle-group-id/{muscleGroupId}")
    MuscleGroupExercises findAllExercisesByMuscleGroupId(@PathVariable Long muscleGroupId) {
        return exerciseService.findAllExercisesByMuscleGroupId(muscleGroupId);
    }

    @GetMapping("find-cardio-exercises")
    List<Exercise> findCardioExercises(@AuthenticationPrincipal UserEntity userEntity) {
        return exerciseService.findCardioExercises(userEntity);
    }

    @GetMapping("{exerciseId}")
    ExerciseMuscle findExerciseMuscle(@PathVariable Long exerciseId) {
        return exerciseService.findExerciseMuscle(exerciseId);
    }

    @PostMapping
    Exercise createOrUpdateExercise(@RequestBody ExerciseMuscle exerciseMuscle) {
        return exerciseService.createOrUpdateExercise(exerciseMuscle);
    }
}

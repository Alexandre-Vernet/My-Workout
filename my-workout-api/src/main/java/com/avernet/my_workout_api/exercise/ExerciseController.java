package com.avernet.my_workout_api.exercise;

import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ExerciseController {

    @Resource
    ExerciseService exerciseService;

    @GetMapping("/find-all-exercises-by-muscle-group-id")
    List<Exercise> findAllExercisesByMuscleGroupId() {
        return exerciseService.findAllExercisesByMuscleGroupId();
    }
}

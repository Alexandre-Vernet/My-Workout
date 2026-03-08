package com.avernet.myworkoutapi.exercise;

import jakarta.annotation.Resource;
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
    List<Exercise> findCardioExercises() {
        return exerciseService.findCardioExercises();
    }

    @PostMapping()
    Exercise createExercise(@RequestBody Exercise exercise) {
        return exerciseService.createExercise(exercise);
    }
}

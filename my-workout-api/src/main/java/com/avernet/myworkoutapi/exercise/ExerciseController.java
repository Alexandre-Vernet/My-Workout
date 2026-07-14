package com.avernet.myworkoutapi.exercise;

import com.avernet.myworkoutapi.exercisemuscle.ExerciseMuscle;
import com.avernet.myworkoutapi.exercisemuscle.ExerciseMuscleAddedToWorkout;
import com.avernet.myworkoutapi.user.UserEntity;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("exercises")
public class ExerciseController {

    @Resource
    ExerciseService exerciseService;

    @GetMapping
    List<Exercise> findAll() {
        return exerciseService.findAll();
    }

    @GetMapping("search")
    List<Exercise> search(@RequestParam String search) {
        return exerciseService.search(search);
    }

    @GetMapping("muscle-group/{muscleGroupId}")
    List<Exercise> findExercisesByMuscleGroup(@PathVariable Long muscleGroupId) {
        return exerciseService.findExercisesByMuscleGroup(muscleGroupId);
    }

    @GetMapping("cardio")
    List<Exercise> findCardioExercises(@AuthenticationPrincipal UserEntity userEntity) {
        return exerciseService.findCardioExercises(userEntity);
    }

    @GetMapping("{exerciseId}")
    ExerciseMuscleAddedToWorkout findExercisesMuscle(@PathVariable Long exerciseId) {
        return exerciseService.findExercisesMuscle(exerciseId);
    }

    @GetMapping("description")
    ExerciseDescriptionResponse generateExerciseDescription(@RequestParam("exerciseName") String exerciseName) {
        return exerciseService.generateExerciseDescription(exerciseName);
    }

    @PostMapping
    Exercise createOrUpdateExercise(@Valid @RequestBody ExerciseMuscle exerciseMuscle) {
        return exerciseService.createOrUpdateExercise(exerciseMuscle);
    }
}

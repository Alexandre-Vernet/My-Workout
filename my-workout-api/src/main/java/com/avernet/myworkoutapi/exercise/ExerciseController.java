package com.avernet.myworkoutapi.exercise;

import com.avernet.myworkoutapi.exercisemuscle.ExerciseMuscle;
import com.avernet.myworkoutapi.exercisemuscle.ExerciseMuscleAddedToWorkout;
import com.avernet.myworkoutapi.user.UserEntity;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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

    @GetMapping("{exerciseId}")
    ExerciseMuscleAddedToWorkout findExercisesMuscle(@PathVariable Long exerciseId) {
        return exerciseService.findExercisesMuscle(exerciseId);
    }

    // Same bound as Exercise.name: the value is interpolated into the Gemini prompt, so it is
    // kept as short as an exercise name actually is.
    @GetMapping("description")
    ExerciseDescriptionResponse generateExerciseDescription(@RequestParam("exerciseName") @NotBlank(message = "Champ requis")
                                                            @Size(max = Exercise.NAME_MAX_LENGTH, message = "40 caractères max.") String exerciseName) {
        return exerciseService.generateExerciseDescription(exerciseName);
    }

    @PostMapping
    Exercise createOrUpdateExercise(@Valid @RequestBody ExerciseMuscle exerciseMuscle) {
        return exerciseService.createOrUpdateExercise(exerciseMuscle);
    }

    @GetMapping("user/cardio")
    List<Exercise> findCardioExercises(@AuthenticationPrincipal UserEntity userEntity) {
        return exerciseService.findCardioExercises(userEntity);
    }

    @PostMapping("user/toggle")
    Exercise toggleExercise(@AuthenticationPrincipal UserEntity userEntity, @RequestBody Exercise exercise) {
        return exerciseService.toggleExercise(userEntity, exercise);
    }

    @GetMapping("user/added/{muscleGroupId}")
    List<Exercise> findAddedExercisesByMuscleGroupId(@AuthenticationPrincipal UserEntity userEntity, @PathVariable Long muscleGroupId) {
        return exerciseService.findAddedExercisesByMuscleGroupId(userEntity, muscleGroupId);
    }
}

package com.avernet.myworkoutapi.musclegroup;

import com.avernet.myworkoutapi.user.UserEntity;
import jakarta.annotation.Resource;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("muscle-group")
public class MuscleGroupController {

    @Resource
    MuscleGroupService muscleGroupService;

    @GetMapping
    List<MuscleGroup> findAll() {
        return muscleGroupService.findAll();
    }

    @GetMapping("recommended")
    List<MuscleGroupExerciseCount>findAllMuscleGroupAndRecommendedMuscleGroup(@AuthenticationPrincipal UserEntity userEntity) {
        return muscleGroupService.findAllMuscleGroupAndRecommendedMuscleGroup(userEntity);
    }
}

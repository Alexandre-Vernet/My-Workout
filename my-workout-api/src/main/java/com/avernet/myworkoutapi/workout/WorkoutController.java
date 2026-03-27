package com.avernet.myworkoutapi.workout;

import com.avernet.myworkoutapi.user.UserEntity;
import jakarta.annotation.Resource;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("workout")
public class WorkoutController {

    @Resource
    WorkoutService workoutService;

    @PostMapping
    Workout create(@AuthenticationPrincipal UserEntity userEntity, @RequestBody WorkoutRequest workoutRequest) {
        return workoutService.createWorkout(userEntity, workoutRequest);
    }

    @GetMapping("{id}")
    WorkoutGroupedHistories find(@PathVariable Long id) {
        return workoutService.find(id);
    }

    @GetMapping("find-by-date")
    List<Workout> findByDate(@AuthenticationPrincipal UserEntity userEntity, @RequestParam String start, @RequestParam String end) {
        return workoutService.findByDate(userEntity, start, end);
    }

    @GetMapping("count-total-days-workout")
    Integer countTotalDaysWorkout(@AuthenticationPrincipal UserEntity userEntity) {
        return workoutService.countTotalDaysWorkout(userEntity);
    }

    @DeleteMapping("{id}")
    void delete(@AuthenticationPrincipal UserEntity userEntity, @PathVariable Long id) {
        workoutService.delete(userEntity, id);
    }
}

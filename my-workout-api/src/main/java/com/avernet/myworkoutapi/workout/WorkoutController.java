package com.avernet.myworkoutapi.workout;

import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/workout")
public class WorkoutController {

    @Resource
    WorkoutService workoutService;

    @PostMapping()
    Workout create(@RequestBody Workout workout) {
        return workoutService.createWorkout(workout);
    }

    @GetMapping("find-by-date")
    List<Workout> findByDate(@RequestParam String start, @RequestParam String end) {
        return workoutService.findByDate(start, end);
    }

    @GetMapping("count-total-days-workout")
    Integer countTotalDaysWorkout() {
        return workoutService.countTotalDaysWorkout();
    }

    @DeleteMapping
    void delete(@RequestParam Long id) {
        workoutService.delete(id);
    }
}

package com.avernet.myworkoutapi.history;

import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("history")
public class HistoryController {

    @Resource
    HistoryService historyService;

    @GetMapping("last/{exerciseId}")
    History findLastHistoryWeightByExerciseId(@PathVariable Long exerciseId) {
        return historyService.findLastHistoryWeightByExerciseId(exerciseId);
    }

    @GetMapping("today/{muscleGroupId}/{exerciseId}")
    List<History> findTodayExercices(@PathVariable Long muscleGroupId, @PathVariable Long exerciseId) {
        return historyService.findTodayExercices(muscleGroupId, exerciseId);
    }

    @PostMapping()
    History create(@RequestBody History history) {
        return historyService.create(history);
    }

    @PatchMapping("{historyId}")
    History update(@PathVariable Long historyId, @RequestBody History history) {
        return historyService.update(historyId, history);
    }
}

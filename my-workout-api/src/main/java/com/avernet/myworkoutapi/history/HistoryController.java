package com.avernet.myworkoutapi.history;

import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("history")
public class HistoryController {

    @Resource
    HistoryService historyService;

    @GetMapping("last/{exerciseId}")
    History findLastHistoryWeightByExerciseId(@PathVariable Long exerciseId) {
        return historyService.findLastHistoryWeightByExerciseId(exerciseId);
    }
}

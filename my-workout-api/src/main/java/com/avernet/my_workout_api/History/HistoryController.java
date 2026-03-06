package com.avernet.my_workout_api.History;

import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HistoryController {

    @Resource
    HistoryService historyService;
}

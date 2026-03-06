package com.avernet.myworkoutapi.history;

import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HistoryController {

    @Resource
    HistoryService historyService;
}

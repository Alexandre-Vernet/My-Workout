package com.avernet.myworkoutapi.muscle;

import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("muscle")
public class MuscleController {

    @Resource
    MuscleService muscleService;

    @GetMapping
    List<MuscleDropdown> findAllMuscle() {
        return muscleService.findAllMuscle();
    }
}

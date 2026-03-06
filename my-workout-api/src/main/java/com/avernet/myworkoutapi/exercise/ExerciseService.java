package com.avernet.myworkoutapi.exercise;

import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ExerciseService {

    @Resource
    ExerciseRepository exerciseRepository;

    List<Exercise> findAllExercisesByMuscleGroupId() {
        return new ArrayList<>();
    }
}

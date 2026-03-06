package com.avernet.myworkoutapi.exercise;

import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExerciseService {

    @Resource
    ExerciseRepository exerciseRepository;

    @Resource
    ExerciseMapper exerciseMapper;

    List<Exercise> findAllExercisesByMuscleGroupId(Long muscleGroupId) {
        List<ExerciseEntity> exerciseEntityList = exerciseRepository.findAllByMuscleGroup(muscleGroupId);
        return exerciseMapper.toDtoList(exerciseEntityList);
    }
}

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

    Exercise createExercise(Exercise exercise) {
        ExerciseEntity exerciseEntity = exerciseMapper.toEntity(exercise);
        ExerciseEntity finalExerciseEntity = exerciseEntity;
        exerciseEntity.exerciseMuscleList.forEach(em -> em.setExercise(finalExerciseEntity));
        exerciseEntity = exerciseRepository.save(exerciseEntity);
        return exerciseMapper.toDto(exerciseEntity);
    }
}

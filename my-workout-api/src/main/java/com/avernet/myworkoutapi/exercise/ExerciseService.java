package com.avernet.myworkoutapi.exercise;

import com.avernet.myworkoutapi.auth.AuthService;
import com.avernet.myworkoutapi.exception.NotFoundException;
import com.avernet.myworkoutapi.musclegroup.MuscleGroup;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupEntity;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupMapper;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupRepository;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupType;
import com.avernet.myworkoutapi.user.UserEntity;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExerciseService {

    @Resource
    AuthService authService;

    @Resource
    ExerciseRepository exerciseRepository;

    @Resource
    MuscleGroupRepository muscleGroupRepository;

    @Resource
    ExerciseMapper exerciseMapper;

    @Resource
    private MuscleGroupMapper muscleGroupMapper;

    MuscleGroupExercises findAllExercisesByMuscleGroupId(Long muscleGroupId) {
        List<ExerciseEntity> exerciseEntityList = exerciseRepository.findAllByMuscleGroup(muscleGroupId);
        List<Exercise> exerciseList = exerciseMapper.toDtoList(exerciseEntityList);

        MuscleGroupEntity muscleGroupEntity = muscleGroupRepository.findById(muscleGroupId).orElseThrow(() -> new NotFoundException("Ce muscle n'existe pas"));
        MuscleGroup muscleGroup = muscleGroupMapper.toDto(muscleGroupEntity);

        return new MuscleGroupExercises(muscleGroup, exerciseList);
    }

    List<Exercise> findCardioExercises() {
        UserEntity userEntity = authService.getCurrentUserEntity();
        List<ExerciseEntity> exerciseEntityList = exerciseRepository.findCardioExercises(userEntity.getId(), MuscleGroupType.CARDIO);
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

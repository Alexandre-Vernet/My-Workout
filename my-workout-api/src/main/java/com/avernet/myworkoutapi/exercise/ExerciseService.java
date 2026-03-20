package com.avernet.myworkoutapi.exercise;

import com.avernet.myworkoutapi.auth.AuthService;
import com.avernet.myworkoutapi.exception.ApiException;
import com.avernet.myworkoutapi.exception.ErrorCodeEnum;
import com.avernet.myworkoutapi.musclegroup.MuscleGroup;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupEntity;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupMapper;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupRepository;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupType;
import com.avernet.myworkoutapi.user.UserEntity;
import jakarta.annotation.Resource;
import org.springframework.http.HttpStatus;
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
    MuscleGroupMapper muscleGroupMapper;

    @Resource
    ExerciseAddedToWorkoutMapper exerciseAddedToWorkoutMapper;

    @Resource
    ExerciseOrderMapper exerciseOrderMapper;

    MuscleGroupExercises findAllExercisesByMuscleGroupId(Long muscleGroupId) {
        MuscleGroupEntity muscleGroupEntity = muscleGroupRepository.findById(muscleGroupId).orElseThrow(() ->
            new ApiException(ErrorCodeEnum.UNKNOWN_MUSCLE, "Ce muscle n'existe pas", HttpStatus.NOT_FOUND));

        UserEntity userEntity = authService.getCurrentUserEntity();

        MuscleGroup muscleGroup = muscleGroupMapper.toDto(muscleGroupEntity);

        List<ExerciseAddedToWorkoutEntity> exerciseAddedToWorkoutEntityList = exerciseRepository.findAllExercisesByMuscleGroupId(userEntity.getId(), muscleGroupId);
        List<ExerciseAddedToWorkout> exerciseAddedToWorkoutList = exerciseAddedToWorkoutMapper.toDtoList(exerciseAddedToWorkoutEntityList);

        return new MuscleGroupExercises(muscleGroup, exerciseAddedToWorkoutList);
    }

    List<ExerciseOrder> findAddedExercisesByMuscleGroupId(Integer muscleGroupId) {
        UserEntity userEntity = authService.getCurrentUserEntity();
        List<ExerciseOrderEntity> exerciseOrderEntityList = exerciseRepository.findAddedExercisesByMuscleGroupId(userEntity.getId(), muscleGroupId);
        return exerciseOrderMapper.toDtoList(exerciseOrderEntityList);
    }

    List<Exercise> findCardioExercises() {
        UserEntity userEntity = authService.getCurrentUserEntity();
        List<ExerciseEntity> exerciseEntityList = exerciseRepository.findCardioExercises(userEntity.getId(), MuscleGroupType.CARDIO);
        return exerciseMapper.toDtoList(exerciseEntityList);
    }

    public Exercise find(Long exerciseId) {
        ExerciseEntity exerciseEntity = exerciseRepository.findById(exerciseId)
            .orElseThrow(() -> new ApiException(ErrorCodeEnum.EXERCISE_NOT_FOUND, "Cet exercice n'existe pas", HttpStatus.NOT_FOUND));

        return exerciseMapper.toDto(exerciseEntity);
    }

    Exercise createExercise(Exercise exercise) {
        ExerciseEntity exerciseEntity = exerciseMapper.toEntity(exercise);
        ExerciseEntity finalExerciseEntity = exerciseEntity;
        exerciseEntity.exerciseMuscleList.forEach(em -> em.setExercise(finalExerciseEntity));
        exerciseEntity = exerciseRepository.save(exerciseEntity);
        return exerciseMapper.toDto(exerciseEntity);
    }
}

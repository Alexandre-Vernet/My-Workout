package com.avernet.myworkoutapi.musclegroup;

import com.avernet.myworkoutapi.auth.AuthService;
import com.avernet.myworkoutapi.user.UserEntity;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MuscleGroupService {

    @Resource
    AuthService authService;

    @Resource
    MuscleGroupRepository muscleGroupRepository;

    @Resource
    MuscleGroupMapper muscleGroupMapper;

    @Resource
    MuscleGroupExerciseCountMapper muscleGroupExerciseCountMapper;


    List<MuscleGroup> findAll() {
        List<MuscleGroupEntity> muscleGroupEntityList = muscleGroupRepository.findAll();
        return muscleGroupMapper.toDtoList(muscleGroupEntityList);
    }

    List<MuscleGroupExerciseCount>findAllMuscleGroupAndCountAddedExercises() {
        UserEntity userEntity = authService.getCurrentUserEntity();
        List<MuscleGroupExerciseCountEntity> muscleGroupEntityList = muscleGroupRepository.findAllMuscleGroupAndCountAddedExercises(userEntity.getId());

        return muscleGroupExerciseCountMapper.toDtoList(muscleGroupEntityList);
    }
}

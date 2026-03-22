package com.avernet.myworkoutapi.musclegroup;

import com.avernet.myworkoutapi.auth.AuthService;
import com.avernet.myworkoutapi.user.UserEntity;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Comparator;
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
        List<MuscleGroupEntity> muscleGroupEntityList = muscleGroupRepository.findAll(Sort.by(Sort.Direction.ASC, "name"));
        return muscleGroupMapper.toDtoList(muscleGroupEntityList);
    }

    List<MuscleGroupExerciseCount> findAllMuscleGroupAndRecommendedMuscleGroup() {
        UserEntity userEntity = authService.getCurrentUserEntity();
        List<MuscleGroupExerciseCountEntity> muscleGroupEntityList = muscleGroupRepository.findAllMuscleGroupAndCountAddedExercises(userEntity.getId());

        List<MuscleGroupExerciseCountEntity> muscleGroupEntityListSorted = muscleGroupEntityList.stream()
            .sorted(Comparator.comparing(MuscleGroupExerciseCountEntity::lastWorkout)
                .thenComparing(muscleGroupExerciseCountEntity -> muscleGroupExerciseCountEntity.muscleGroup().getName()))
            .toList();


        return muscleGroupExerciseCountMapper.toDtoList(muscleGroupEntityListSorted);
    }
}

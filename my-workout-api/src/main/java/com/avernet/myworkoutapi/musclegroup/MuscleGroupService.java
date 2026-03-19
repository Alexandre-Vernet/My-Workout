package com.avernet.myworkoutapi.musclegroup;

import com.avernet.myworkoutapi.auth.AuthService;
import com.avernet.myworkoutapi.user.UserEntity;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

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

    List<MuscleGroupExerciseCount> findAllMuscleGroupAndRecommendedMuscleGroup() {
        UserEntity userEntity = authService.getCurrentUserEntity();
        List<MuscleGroupExerciseCountEntity> muscleGroupEntityList = muscleGroupRepository.findAllMuscleGroupAndCountAddedExercises(userEntity.getId());
        muscleGroupEntityList.stream()
            .min(Comparator.comparing(
                e -> Optional.ofNullable(e.getLastWorkout()).orElse(LocalDate.MIN)
            ))
            .ifPresent(recommended -> recommended.setRecommended(true));

        List<MuscleGroupExerciseCountEntity> muscleGroupEntityListSorted = muscleGroupEntityList.stream()
            .sorted(Comparator.comparing(MuscleGroupExerciseCountEntity::isRecommended).reversed()
                .thenComparing(muscleGroupExerciseCountEntity -> muscleGroupExerciseCountEntity.getMuscleGroup().getName()))
            .toList();


        return muscleGroupExerciseCountMapper.toDtoList(muscleGroupEntityListSorted);
    }
}

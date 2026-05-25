package com.avernet.myworkoutapi.musclegroup;

import com.avernet.myworkoutapi.user.UserEntity;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
public class MuscleGroupService {

    @Resource
    MuscleGroupRepository muscleGroupRepository;

    @Resource
    MuscleGroupMapper muscleGroupMapper;

    @Resource
    MuscleGroupExerciseCountMapper muscleGroupExerciseCountMapper;


    @Transactional(readOnly = true)
    public List<MuscleGroup> findAll() {
        List<MuscleGroupEntity> muscleGroupEntityList = muscleGroupRepository.findAll(Sort.by(Sort.Direction.ASC, "name"));
        return muscleGroupMapper.toDtoList(muscleGroupEntityList);
    }

    @Transactional(readOnly = true)
    public List<MuscleGroupExerciseCount> findAllMuscleGroupAndRecommendedMuscleGroup(UserEntity userEntity) {
        List<MuscleGroupExerciseCountEntity> muscleGroupEntityList = muscleGroupRepository.findAllMuscleGroupAndCountAddedExercises(userEntity.getId());

        List<MuscleGroupExerciseCountEntity> muscleGroupEntityListSorted = muscleGroupEntityList.stream()
            .sorted(Comparator.comparing(MuscleGroupExerciseCountEntity::lastWorkout, Comparator.nullsFirst(Comparator.naturalOrder()))
                .thenComparing(muscleGroupExerciseCountEntity -> muscleGroupExerciseCountEntity.muscleGroup().getName()))
            .toList();


        return muscleGroupExerciseCountMapper.toDtoList(muscleGroupEntityListSorted);
    }
}

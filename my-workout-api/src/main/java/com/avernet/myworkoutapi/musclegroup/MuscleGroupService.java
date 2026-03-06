package com.avernet.myworkoutapi.musclegroup;

import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MuscleGroupService {

    @Resource
    MuscleGroupRepository muscleGroupRepository;

    @Resource MuscleGroupMapper muscleGroupMapper;

    List<MuscleGroup> findAll() {
        List<MuscleGroupEntity> muscleGroupEntityList = muscleGroupRepository.findAll();
        return muscleGroupMapper.toDtoList(muscleGroupEntityList);
    }
}

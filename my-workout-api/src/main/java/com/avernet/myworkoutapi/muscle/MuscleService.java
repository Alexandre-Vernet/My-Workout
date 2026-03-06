package com.avernet.myworkoutapi.muscle;

import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MuscleService {
    @Resource
    MuscleRepository muscleRepository;

    @Resource
    MuscleMapper muscleMapper;

    List<Muscle> findAllMuscle() {
        List<MuscleEntity> muscleEntityList = muscleRepository.findAllByOrderByMuscleGroupNameAsc();
        return muscleMapper.toDtoList(muscleEntityList);
    }
}

package com.avernet.myworkoutapi.muscle;

import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MuscleService {

    @Resource
    MuscleRepository muscleRepository;


    @Transactional(readOnly = true)
    public List<MuscleDropdown> findAllMuscle() {
        List<MuscleEntity> muscleEntityList = muscleRepository.findAllByOrderByMuscleGroupNameAsc();

        return muscleEntityList.stream()
            .collect(Collectors.groupingBy(m -> m.getMuscleGroup().getName().name(), LinkedHashMap::new, Collectors.toList()))
            .entrySet().stream()
            .map(entry -> {
                String groupName = entry.getKey();
                List<Item> items = entry.getValue().stream()
                    .map(m -> new Item(m.getId(), m.getName()))
                    .collect(Collectors.toList());
                return new MuscleDropdown(groupName, groupName, items);
            })
            .collect(Collectors.toList());
    }
}

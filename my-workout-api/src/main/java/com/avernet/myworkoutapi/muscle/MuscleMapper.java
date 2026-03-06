package com.avernet.myworkoutapi.muscle;

import com.avernet.myworkoutapi.config.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MuscleMapper extends GenericMapper<Muscle, MuscleEntity> {
    @Mapping(target = "muscleGroup", ignore = true)
    @Mapping(target = "exerciseMuscleList", ignore = true)
    Muscle toDto(MuscleEntity entity);
}

package com.avernet.myworkoutapi.musclegroup;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MuscleGroupMapper {
    MuscleGroup toDto(MuscleGroupEntity muscleGroupEntity);

    MuscleGroupEntity toEntity(MuscleGroup muscleGroup);
}

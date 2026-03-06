package com.avernet.my_workout_api.MuscleGroup;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MuscleGroupMapper {
    MuscleGroup toDto(MuscleGroupEntity muscleGroupEntity);

    MuscleGroupEntity toEntity(MuscleGroup muscleGroup);
}

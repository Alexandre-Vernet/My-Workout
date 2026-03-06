package com.avernet.my_workout_api.Muscle;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MuscleMapper {
    Muscle toDto(MuscleEntity muscleEntity);

    MuscleEntity toEntity(Muscle muscle);
}

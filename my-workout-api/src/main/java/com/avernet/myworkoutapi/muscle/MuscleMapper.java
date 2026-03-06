package com.avernet.myworkoutapi.muscle;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MuscleMapper {
    Muscle toDto(MuscleEntity muscleEntity);

    MuscleEntity toEntity(Muscle muscle);
}

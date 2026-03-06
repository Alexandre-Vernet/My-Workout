package com.avernet.myworkoutapi.musclegroup;

import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MuscleGroupMapper {
    MuscleGroup toDto(MuscleGroupEntity muscleGroupEntity);

    List<MuscleGroup> toDtoList(List<MuscleGroupEntity> muscleGroupEntityList);

    MuscleGroupEntity toEntity(MuscleGroup muscleGroup);

    List<MuscleGroupEntity> toEntityList(List<MuscleGroup> muscleGroupEntityList);

}

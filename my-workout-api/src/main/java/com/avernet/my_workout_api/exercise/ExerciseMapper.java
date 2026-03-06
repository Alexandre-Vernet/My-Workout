package com.avernet.my_workout_api.exercise;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ExerciseMapper {
    Exercise toDto(ExerciseEntity exerciseEntity);

    ExerciseEntity toEntity(Exercise exercise);
}

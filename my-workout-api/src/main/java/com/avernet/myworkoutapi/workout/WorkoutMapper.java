package com.avernet.myworkoutapi.workout;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface WorkoutMapper {
    Workout toDto(WorkoutEntity workoutEntity);

    WorkoutEntity toEntity(Workout workout);
}

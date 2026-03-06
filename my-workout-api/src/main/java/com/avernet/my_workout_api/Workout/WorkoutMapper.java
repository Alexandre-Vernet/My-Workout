package com.avernet.my_workout_api.Workout;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface WorkoutMapper {
    Workout toDto(WorkoutEntity workoutEntity);

    WorkoutEntity toEntity(Workout workout);
}

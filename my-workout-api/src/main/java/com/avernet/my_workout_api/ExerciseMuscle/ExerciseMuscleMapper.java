package com.avernet.my_workout_api.ExerciseMuscle;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ExerciseMuscleMapper {
    ExerciseMuscle toDto(ExerciseMuscleEntity exerciseMuscleEntity);

    ExerciseMuscleEntity toEntity(ExerciseMuscle exerciseMuscle);
}

package com.avernet.myworkoutapi.exercisemuscle;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ExerciseMuscleMapper {
    ExerciseMuscle toDto(ExerciseMuscleEntity exerciseMuscleEntity);

    ExerciseMuscleEntity toEntity(ExerciseMuscle exerciseMuscle);
}

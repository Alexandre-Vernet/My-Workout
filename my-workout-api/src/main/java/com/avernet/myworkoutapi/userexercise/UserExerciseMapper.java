package com.avernet.myworkoutapi.userexercise;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserExerciseMapper {
    UserExercise toDto(UserExerciseEntity userExerciseEntity);

    UserExerciseEntity toEntity(UserExercise userExercise);
}

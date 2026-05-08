package com.avernet.myworkoutapi.userexercise;

import com.avernet.myworkoutapi.config.GenericMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserExerciseMapper extends GenericMapper<UserExercise, UserExerciseEntity> {
}

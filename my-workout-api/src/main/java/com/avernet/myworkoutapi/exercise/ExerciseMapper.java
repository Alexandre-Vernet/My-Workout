package com.avernet.myworkoutapi.exercise;

import com.avernet.myworkoutapi.config.GenericMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ExerciseMapper extends GenericMapper<Exercise, ExerciseEntity> {
}

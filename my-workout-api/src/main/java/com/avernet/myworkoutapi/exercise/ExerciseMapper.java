package com.avernet.myworkoutapi.exercise;

import com.avernet.myworkoutapi.config.GenericMapper;
import com.avernet.myworkoutapi.muscle.MuscleMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = MuscleMapper.class)
public interface ExerciseMapper extends GenericMapper<Exercise, ExerciseEntity> {

    @Mapping(source = "exerciseMuscles", target = "muscles")
    Exercise toDto(ExerciseEntity entity);
}

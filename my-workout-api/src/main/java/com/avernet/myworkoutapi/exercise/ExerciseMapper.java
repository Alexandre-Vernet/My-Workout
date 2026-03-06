package com.avernet.myworkoutapi.exercise;

import com.avernet.myworkoutapi.config.GenericMapper;
import com.avernet.myworkoutapi.exercisemuscle.ExerciseMuscle;
import com.avernet.myworkoutapi.exercisemuscle.ExerciseMuscleEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ExerciseMapper extends GenericMapper<Exercise, ExerciseEntity> {
    @Mapping(target = "exercise", ignore = true)
    ExerciseMuscle toDto(ExerciseMuscleEntity entity);
}

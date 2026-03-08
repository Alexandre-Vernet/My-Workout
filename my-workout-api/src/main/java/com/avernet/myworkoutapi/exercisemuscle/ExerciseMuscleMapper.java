package com.avernet.myworkoutapi.exercisemuscle;

import com.avernet.myworkoutapi.config.GenericMapper;
import com.avernet.myworkoutapi.exercise.Exercise;
import com.avernet.myworkoutapi.exercise.ExerciseEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ExerciseMuscleMapper extends GenericMapper<ExerciseMuscle, ExerciseMuscleEntity> {
    @Mapping(target = "exercise", ignore = true)
    ExerciseMuscle toDto(ExerciseMuscleEntity exerciseMuscleEntity);
}

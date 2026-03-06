package com.avernet.myworkoutapi.exercisemuscle;

import com.avernet.myworkoutapi.config.GenericMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ExerciseMuscleMapper extends GenericMapper<ExerciseMuscle, ExerciseMuscleEntity> {
}

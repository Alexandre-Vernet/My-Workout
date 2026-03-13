package com.avernet.myworkoutapi.exercise;

import com.avernet.myworkoutapi.config.GenericMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {ExerciseMapper.class})
public interface ExerciseAddedToWorkoutMapper extends GenericMapper<ExerciseAddedToWorkout, ExerciseAddedToWorkoutEntity> {
}

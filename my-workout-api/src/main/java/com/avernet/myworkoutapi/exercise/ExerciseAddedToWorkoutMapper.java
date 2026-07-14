package com.avernet.myworkoutapi.exercise;

import com.avernet.myworkoutapi.config.GenericMapper;
import com.avernet.myworkoutapi.userexercise.UserExerciseMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {ExerciseMapper.class, UserExerciseMapper.class})
public interface ExerciseAddedToWorkoutMapper extends GenericMapper<ExerciseAddedToWorkout, ExerciseAddedToWorkoutEntity> {
}

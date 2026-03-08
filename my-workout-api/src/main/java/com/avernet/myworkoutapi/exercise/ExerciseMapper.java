package com.avernet.myworkoutapi.exercise;

import com.avernet.myworkoutapi.config.GenericMapper;
import com.avernet.myworkoutapi.exercisemuscle.ExerciseMuscleMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {ExerciseMuscleMapper.class})
public interface ExerciseMapper extends GenericMapper<Exercise, ExerciseEntity> {
}

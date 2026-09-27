package com.avernet.myworkoutapi.exercise;

import com.avernet.myworkoutapi.config.GenericMapper;
import com.avernet.myworkoutapi.muscle.MuscleMapper;
import com.avernet.myworkoutapi.userexercise.UserExerciseEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = MuscleMapper.class)
public interface ExerciseMapper extends GenericMapper<Exercise, ExerciseEntity> {

    @Mapping(source = "exerciseMuscles", target = "muscles")
    Exercise toDto(ExerciseEntity entity);

    @Mapping(source = "exercise", target = ".")
    @Mapping(source = "order", target = "order")
    Exercise toDtoUserExercise(UserExerciseEntity userExercise);

    List<Exercise> toDtoUserExercise(List<UserExerciseEntity> userExercises);
}

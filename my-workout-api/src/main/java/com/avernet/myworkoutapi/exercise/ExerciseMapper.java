package com.avernet.myworkoutapi.exercise;

import com.avernet.myworkoutapi.config.GenericMapper;
import com.avernet.myworkoutapi.exercisemuscle.ExerciseMuscleEntity;
import com.avernet.myworkoutapi.muscle.Muscle;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ExerciseMapper extends GenericMapper<Exercise, ExerciseEntity> {
    @Mapping(source = "exerciseMuscles", target = "muscles")
    Exercise toDto(ExerciseEntity entity);

    default Muscle map(ExerciseMuscleEntity exerciseMuscleEntity) {
        return new Muscle(
            exerciseMuscleEntity.getMuscle().getId(),
            exerciseMuscleEntity.getMuscle().getName(),
            null
        );
    }
}

package com.avernet.myworkoutapi.muscle;

import com.avernet.myworkoutapi.config.GenericMapper;
import com.avernet.myworkoutapi.exercisemuscle.ExerciseMuscleEntity;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = MuscleGroupMapper.class)
public interface MuscleMapper extends GenericMapper<Muscle, MuscleEntity> {

    @Override
    @Mapping(target = "muscleGroup", source = "muscleGroup")
    Muscle toDto(MuscleEntity muscleEntity);

    default Muscle map(ExerciseMuscleEntity exerciseMuscleEntity) {
        return toDto(exerciseMuscleEntity.getMuscle());
    }
}

package com.avernet.myworkoutapi.musclegroup;

import com.avernet.myworkoutapi.config.GenericMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MuscleGroupExerciseCountMapper extends GenericMapper<MuscleGroupExerciseCount, MuscleGroupExerciseCountEntity> {
}

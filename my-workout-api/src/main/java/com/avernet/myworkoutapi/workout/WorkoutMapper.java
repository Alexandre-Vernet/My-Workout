package com.avernet.myworkoutapi.workout;

import com.avernet.myworkoutapi.config.GenericMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface WorkoutMapper extends GenericMapper<Workout, WorkoutEntity> {
}

package com.avernet.myworkoutapi.workout;

import com.avernet.myworkoutapi.config.GenericMapper;
import com.avernet.myworkoutapi.history.HistoryMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {HistoryMapper.class})
public interface WorkoutMapper extends GenericMapper<Workout, WorkoutEntity> {
}

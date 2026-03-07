package com.avernet.myworkoutapi.history;

import com.avernet.myworkoutapi.config.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface HistoryMapper extends GenericMapper<History, HistoryEntity> {
    @Mapping(target = "workout", ignore = true)
    @Mapping(target = "exercise", ignore = true)
    History toDto(HistoryEntity entity);
}

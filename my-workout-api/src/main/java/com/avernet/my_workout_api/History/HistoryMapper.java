package com.avernet.my_workout_api.History;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface HistoryMapper {
    History toDto(HistoryEntity historyEntity);

    HistoryEntity toEntity(History history);
}

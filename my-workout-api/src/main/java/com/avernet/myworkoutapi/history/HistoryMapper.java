package com.avernet.myworkoutapi.history;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface HistoryMapper {
    History toDto(HistoryEntity historyEntity);

    HistoryEntity toEntity(History history);
}

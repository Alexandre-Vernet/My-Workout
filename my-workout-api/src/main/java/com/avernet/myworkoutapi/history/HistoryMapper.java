package com.avernet.myworkoutapi.history;

import com.avernet.myworkoutapi.config.GenericMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface HistoryMapper extends GenericMapper<History, HistoryEntity> {
}

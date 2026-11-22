package com.avernet.myworkoutapi.gym;

import com.avernet.myworkoutapi.config.GenericMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface GymMapper extends GenericMapper<Gym, GymEntity> {
}

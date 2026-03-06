package com.avernet.myworkoutapi.muscle;

import com.avernet.myworkoutapi.config.GenericMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MuscleMapper extends GenericMapper<Muscle, MuscleEntity> {
}

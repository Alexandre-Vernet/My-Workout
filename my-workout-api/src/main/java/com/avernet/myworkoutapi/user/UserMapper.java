package com.avernet.myworkoutapi.user;

import com.avernet.myworkoutapi.config.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper extends GenericMapper<User, UserEntity> {
    @Mapping(target = "password", ignore = true)
    User toDto(UserEntity userEntity);
}

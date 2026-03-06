package com.avernet.myworkoutapi.user;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toDto(UserEntity userEntity);

    UserEntity toEntity(User user);
}

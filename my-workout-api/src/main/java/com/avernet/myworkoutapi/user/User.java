package com.avernet.myworkoutapi.user;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class User {
    Long id;
    String email;
    String password;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean isAdmin;
}

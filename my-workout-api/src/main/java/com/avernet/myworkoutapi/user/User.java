package com.avernet.myworkoutapi.user;

import java.time.LocalDate;

public record User(
    Long id,
    String email,
    String password,
    LocalDate createdAt,
    LocalDate updatedAt,
    Boolean isAdmin
) {
}

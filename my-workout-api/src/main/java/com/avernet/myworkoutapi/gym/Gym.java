package com.avernet.myworkoutapi.gym;

import com.avernet.myworkoutapi.user.User;

public record Gym(Long id, String name, User user) {
}

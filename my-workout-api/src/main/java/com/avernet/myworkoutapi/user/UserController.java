package com.avernet.myworkoutapi.user;

import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @Resource
    UserService userService;
}

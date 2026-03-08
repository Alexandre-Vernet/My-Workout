package com.avernet.myworkoutapi.auth;

import com.avernet.myworkoutapi.user.User;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("auth")
public class AuthController {

    @Resource
    AuthService authService;

    @GetMapping("me")
    public User me() {
        return authService.getCurrentUserDto();
    }

    @PostMapping("/login")
    public AuthResponse authenticateUser(@RequestBody LoginRequest request) {
        return authService.loginUser(request);
    }

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return authService.registerUser(user);
    }
}

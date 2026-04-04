package com.avernet.myworkoutapi.auth;

import com.avernet.myworkoutapi.user.User;
import com.avernet.myworkoutapi.user.UserEntity;
import jakarta.annotation.Resource;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    User me(@AuthenticationPrincipal UserEntity userEntity) {
        return authService.getCurrentUser(userEntity);
    }

    @PostMapping("login")
    AuthResponse authenticateUser(@RequestBody LoginRequest request) {
        return authService.loginUser(request);
    }

    @PostMapping("register")
    User registerUser(@RequestBody User user) {
        return authService.registerUser(user);
    }

    @PostMapping("refresh")
    AuthResponse refresh(@RequestBody String refreshToken) {
        return authService.refreshToken(refreshToken);
    }
}

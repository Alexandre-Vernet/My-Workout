package com.avernet.myworkoutapi.auth;

import com.avernet.myworkoutapi.user.UpdateUser;
import com.avernet.myworkoutapi.user.User;
import com.avernet.myworkoutapi.user.UserEntity;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
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
    AuthResponse authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        return authService.loginUser(loginRequest);
    }

    @PostMapping("register")
    User registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        return authService.registerUser(registerRequest);
    }

    @PostMapping("refresh")
    AuthResponse refresh(@RequestBody String refreshToken) {
        return authService.refreshToken(refreshToken);
    }

    @PatchMapping("{id}")
    User update(@AuthenticationPrincipal UserEntity userEntity, @Valid @RequestBody UpdateUser updateUser) {
        return authService.update(userEntity, updateUser);
    }

    @DeleteMapping
    void delete(@AuthenticationPrincipal UserEntity userEntity) {
        authService.deleteUser(userEntity);
    }
}

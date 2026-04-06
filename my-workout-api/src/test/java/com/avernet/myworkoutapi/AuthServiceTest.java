package com.avernet.myworkoutapi;

import com.avernet.myworkoutapi.auth.AuthResponse;
import com.avernet.myworkoutapi.auth.AuthService;
import com.avernet.myworkoutapi.auth.LoginRequest;
import com.avernet.myworkoutapi.exception.ApiException;
import com.avernet.myworkoutapi.exception.ErrorCodeEnum;
import com.avernet.myworkoutapi.user.User;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.context.jdbc.Sql;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
@Sql(scripts = "/data.sql")
public class AuthServiceTest {

    @Resource
    AuthService service;


    @Test
    void shouldLoginUser() {
        LoginRequest loginRequest = new LoginRequest("user1@gmail.com", "user123");

        AuthResponse authResponse = service.loginUser(loginRequest);
        assertNotNull(authResponse);
        assertNotNull(authResponse.accessToken());
        assertNotNull(authResponse.refreshToken());
    }

    @Test
    void shouldThrowBadCredentialExceptionIncorrectLogin() {
        LoginRequest loginRequest = new LoginRequest("user1@gmail.com", "user1234");

        assertThrows(BadCredentialsException.class, () -> service.loginUser(loginRequest));
    }

    @Test
    void shouldRegisterUser() {
        User user = User.builder().email("user3@gmail.com").password("123").build();
        User userCreated = service.registerUser(user);
        assertNotNull(userCreated);
    }

    @Test
    void shouldThrowExceptionExistingUserRegister() {
        User user = User.builder().email("user1@gmail.com").password("123").build();
        ApiException apiException = assertThrows(ApiException.class, () -> service.registerUser(user));
        assertEquals(ErrorCodeEnum.EMAIL_ALREADY_IN_USE, apiException.getErrorCode());
        assertEquals("Cet email est déjà utilisé", apiException.getMessage());
    }

    @Test
    void shouldGetRefreshToken() {
        LoginRequest loginRequest = new LoginRequest("user1@gmail.com", "user123");

        String refreshToken = service.loginUser(loginRequest).refreshToken();
        AuthResponse authResponse = service.refreshToken(refreshToken);
        assertNotNull(authResponse);
    }

    @Test
    void shouldThrowExpiredJwtExceptionRefreshToken() {
        String expiredRefreshToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMTBAZ21haWwuY29tIiwiaWF0IjoxNzc1MzAyMjM5LCJleHAiOjF9.ccyVZ5s01zEZcLnhh4s6kgHOCAT7IJm7G7aSwtRHySY";
        assertThrows(ExpiredJwtException.class, () -> service.refreshToken(expiredRefreshToken));
    }
}

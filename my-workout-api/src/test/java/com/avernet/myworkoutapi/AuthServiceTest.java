package com.avernet.myworkoutapi;

import com.avernet.myworkoutapi.auth.AuthResponse;
import com.avernet.myworkoutapi.auth.AuthService;
import com.avernet.myworkoutapi.auth.LoginRequest;
import com.avernet.myworkoutapi.exception.ApiException;
import com.avernet.myworkoutapi.error.ErrorCodeEnum;
import com.avernet.myworkoutapi.user.UpdateUser;
import com.avernet.myworkoutapi.user.User;
import com.avernet.myworkoutapi.user.UserEntity;
import com.avernet.myworkoutapi.user.UserMapper;
import com.avernet.myworkoutapi.user.UserNotFoundException;
import com.avernet.myworkoutapi.user.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.context.jdbc.Sql;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
@Sql(scripts = "/data.sql")
public class AuthServiceTest {

    @Resource
    AuthService service;

    @Resource
    UserRepository userRepository;

    @Resource
    private UserMapper userMapper;

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
        assertFalse(userCreated.getAdmin());
    }

    @Test
    void shouldThrowExceptionExistingUserRegister() {
        User user = User.builder().email("user1@gmail.com").password("123").build();
        ApiException apiException = assertThrows(ApiException.class, () -> service.registerUser(user));
        assertEquals(ErrorCodeEnum.EMAIL_ALREADY_IN_USE, apiException.getErrorCode());
        assertEquals("Cet email est déjà utilisé", apiException.getMessage());
        assertEquals(HttpStatus.CONFLICT, apiException.getHttpStatus());
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

    @Test
    void shouldGetUser() {
        UserEntity userEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);
        User user = service.getCurrentUser(userEntity);
        assertNotNull(user);
        assertNotNull(user.getId());
        assertNotNull(user.getEmail());
        assertFalse(user.getAdmin());
    }

    @Test
    void shouldGetUserAdmin() {
        UserEntity userEntity = userRepository.findById(3L).orElseThrow(UserNotFoundException::new);
        User user = service.getCurrentUser(userEntity);
        assertNotNull(user);
        assertNotNull(user.getId());
        assertNotNull(user.getEmail());
        assertTrue(user.getAdmin());
    }

    @Test
    void shouldUpdateUserEmail() {
        UserEntity userEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);
        UpdateUser updateUser = UpdateUser.builder().email("updatedEmail@gmail.com").build();

        User updatedUser = service.update(userEntity, updateUser);
        UserEntity updatedUserEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);
        assertNotNull(updatedUser);
        assertEquals("updatedEmail@gmail.com", updatedUser.getEmail());
        assertEquals("updatedEmail@gmail.com", updatedUserEntity.getEmail());
        assertNotEquals(userEntity.getUpdatedAt(), updatedUserEntity.getUpdatedAt());
    }

    @Test
    void shouldNotUpdateUserEmailIfEmailAlreadyInUse() {
        UserEntity userEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);
        UpdateUser updateUser = new UpdateUser();
        updateUser.setEmail("user2@gmail.com");   /*This email is already in use*/

        ApiException apiException = assertThrows(ApiException.class, () -> service.update(userEntity, updateUser));
        assertEquals(ErrorCodeEnum.EMAIL_ALREADY_IN_USE, apiException.getErrorCode());
        assertEquals("Cet email est déjà utilisé", apiException.getMessage());
        assertEquals(HttpStatus.CONFLICT, apiException.getHttpStatus());
    }

    @Test
    void shouldUpdateUserPassword() {
        UserEntity userEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);
        UpdateUser updateUser = UpdateUser.builder().email(userEntity.getEmail()).password("updatedPassword").confirmPassword("updatedPassword").build();

        User updatedUser = service.update(userEntity, updateUser);
        UserEntity updatedUserEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);
        assertNotNull(updatedUser);
        assertNotEquals(userEntity.getPassword(), updatedUserEntity.getEmail());
        assertNotEquals(userEntity.getUpdatedAt(), updatedUserEntity.getUpdatedAt());
    }
}

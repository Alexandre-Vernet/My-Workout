package com.avernet.myworkoutapi;

import com.avernet.myworkoutapi.auth.passwordreset.PasswordResetTokenEntity;
import com.avernet.myworkoutapi.auth.passwordreset.PasswordResetTokenRepository;
import com.avernet.myworkoutapi.auth.passwordreset.PasswordResetTokenService;
import com.avernet.myworkoutapi.auth.passwordreset.ResetPasswordTokenPassword;
import com.avernet.myworkoutapi.error.ErrorCodeEnum;
import com.avernet.myworkoutapi.exception.ApiException;
import com.avernet.myworkoutapi.user.UserEntity;
import com.avernet.myworkoutapi.user.UserNotFoundException;
import com.avernet.myworkoutapi.user.UserRepository;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;


@SpringBootTest
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
@Sql(scripts = "/data.sql")
public class PasswordResetTokenServiceTest {

    @Resource
    private PasswordResetTokenService service;

    @Resource
    private PasswordResetTokenRepository repository;

    @Resource
    private UserRepository userRepository;

    @Test
    void generatePasswordResetToken_shouldCreateTokenForExistingUser() {
        String email = "user1@gmail.com";

        UserEntity userEntity = userRepository.findByEmail(email).orElseThrow(UserNotFoundException::new);

        service.generatePasswordResetToken(email);

        assertTrue(repository.findAll().stream()
            .anyMatch(token -> token.getUser().getId().equals(userEntity.getId())));
    }

    @Test
    void generatePasswordResetToken_shouldNotThrowAndNotCreateTokenForUnknownEmail() {
        String email = "user5@gmail.com";

        long tokenCountBefore = repository.count();

        service.generatePasswordResetToken(email);

        assertEquals(tokenCountBefore, repository.count());
    }

    @Test
    void resetPassword_shouldUpdatePassword() {
        String token = "random token";
        String newPassword = "updated password";

        UserEntity userEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);
        String oldPassword = userEntity.getPassword();
        PasswordResetTokenEntity passwordResetTokenEntity = PasswordResetTokenEntity.builder()
            .token(token)
            .user(userEntity)
            .used(false)
            .expirationDate(LocalDateTime.now().plusMinutes(15))
            .build();
        repository.save(passwordResetTokenEntity);


        ResetPasswordTokenPassword resetPasswordTokenPassword = new ResetPasswordTokenPassword(token, newPassword);
        service.resetPassword(resetPasswordTokenPassword);
        PasswordResetTokenEntity updatedPasswordResetTokenEntity = repository.findByToken(token);
        String newUserPassword = userRepository.findById(1L).orElseThrow(UserNotFoundException::new).getPassword();


        assertNotEquals(oldPassword, newUserPassword);
        assertNotNull(updatedPasswordResetTokenEntity);
        assertEquals(token, updatedPasswordResetTokenEntity.getToken());
        assertEquals(userEntity.getId(), updatedPasswordResetTokenEntity.getUser().getId());
        assertTrue(updatedPasswordResetTokenEntity.getUsed());
    }

    @Test
    void resetPassword_shouldThrowWhenTokenDoesNotExist() {
        ResetPasswordTokenPassword resetPasswordTokenPassword = new ResetPasswordTokenPassword("unknown token", "new password");

        ApiException exception = assertThrows(ApiException.class, () -> service.resetPassword(resetPasswordTokenPassword));
        assertEquals(ErrorCodeEnum.INVALID_TOKEN, exception.getErrorCode());
        assertEquals(HttpStatus.FORBIDDEN, exception.getHttpStatus());
    }

    @Test
    void resetPassword_shouldThrowWhenTokenExpired() {
        String token = "expired token";

        UserEntity userEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);
        PasswordResetTokenEntity passwordResetTokenEntity = PasswordResetTokenEntity.builder()
            .token(token)
            .user(userEntity)
            .used(false)
            .expirationDate(LocalDateTime.now().minusMinutes(1))
            .build();
        repository.save(passwordResetTokenEntity);

        ResetPasswordTokenPassword resetPasswordTokenPassword = new ResetPasswordTokenPassword(token, "new password");

        assertThrows(ApiException.class, () -> service.resetPassword(resetPasswordTokenPassword));
    }

    @Test
    void resetPassword_shouldThrowWhenTokenAlreadyUsed() {
        String token = "used token";

        UserEntity userEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);
        PasswordResetTokenEntity passwordResetTokenEntity = PasswordResetTokenEntity.builder()
            .token(token)
            .user(userEntity)
            .used(true)
            .expirationDate(LocalDateTime.now().plusMinutes(15))
            .build();
        repository.save(passwordResetTokenEntity);

        ResetPasswordTokenPassword resetPasswordTokenPassword = new ResetPasswordTokenPassword(token, "new password");

        assertThrows(ApiException.class, () -> service.resetPassword(resetPasswordTokenPassword));
    }

    @Test
    void isTokenValid_shouldReturnTrue() {
        String token = "token";

        UserEntity userEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);
        PasswordResetTokenEntity passwordResetTokenEntity = PasswordResetTokenEntity.builder()
            .token(token)
            .user(userEntity)
            .used(false)
            .expirationDate(LocalDateTime.now().plusMinutes(15))
            .build();
        repository.save(passwordResetTokenEntity);

        assertTrue(service.isTokenValid(token));
    }

    @Test
    void isTokenValid_shouldReturnFalseInvalidToken() {
        String token = "token";
        String fakeToken = "fake token";

        UserEntity userEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);
        PasswordResetTokenEntity passwordResetTokenEntity = PasswordResetTokenEntity.builder()
            .token(token)
            .user(userEntity)
            .used(false)
            .expirationDate(LocalDateTime.now().plusMinutes(15))
            .build();
        repository.save(passwordResetTokenEntity);

        assertFalse(service.isTokenValid(fakeToken));
    }

    @Test
    void isTokenValid_shouldReturnFalseExpiredToken() {
        String token = "token";

        UserEntity userEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);
        PasswordResetTokenEntity passwordResetTokenEntity = PasswordResetTokenEntity.builder()
            .token(token)
            .user(userEntity)
            .used(false)
            .expirationDate(LocalDateTime.now().minusMinutes(30))
            .build();
        repository.save(passwordResetTokenEntity);

        assertFalse(service.isTokenValid(token));
    }

    @Test
    void isTokenValid_shouldReturnFalseUsedToken() {
        String token = "token";

        UserEntity userEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);
        PasswordResetTokenEntity passwordResetTokenEntity = PasswordResetTokenEntity.builder()
            .token(token)
            .user(userEntity)
            .used(true)
            .expirationDate(LocalDateTime.now().minusMinutes(30))
            .build();
        repository.save(passwordResetTokenEntity);

        assertFalse(service.isTokenValid(token));
    }

    @Test
    void deleteExpiredToken_shouldDeleteExpiredToken() {
        String token = "token";

        UserEntity userEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);
        PasswordResetTokenEntity passwordResetTokenEntity = PasswordResetTokenEntity.builder()
            .token(token)
            .user(userEntity)
            .used(true)
            .expirationDate(LocalDateTime.now())
            .build();
        repository.save(passwordResetTokenEntity);

        service.deleteExpiredToken();

        PasswordResetTokenEntity passwordResetToken = repository.findByToken(token);
        assertNull(passwordResetToken);
    }

    @Test
    void deleteExpiredToken_shouldNotDeleteExpiredToken() {
        String token = "token";

        UserEntity userEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);
        PasswordResetTokenEntity passwordResetTokenEntity = PasswordResetTokenEntity.builder()
            .token(token)
            .user(userEntity)
            .used(true)
            .expirationDate(LocalDateTime.now().plusMinutes(30L))
            .build();
        repository.save(passwordResetTokenEntity);

        service.deleteExpiredToken();

        PasswordResetTokenEntity passwordResetToken = repository.findByToken(token);
        assertNotNull(passwordResetToken);
    }
}

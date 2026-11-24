package com.avernet.myworkoutapi;

import com.avernet.myworkoutapi.auth.AuthResponse;
import com.avernet.myworkoutapi.auth.AuthService;
import com.avernet.myworkoutapi.auth.JwtService;
import com.avernet.myworkoutapi.auth.LoginRequest;
import com.avernet.myworkoutapi.auth.RegisterRequest;
import com.avernet.myworkoutapi.auth.passwordreset.PasswordResetTokenEntity;
import com.avernet.myworkoutapi.auth.passwordreset.PasswordResetTokenRepository;
import com.avernet.myworkoutapi.error.ErrorCodeEnum;
import com.avernet.myworkoutapi.exception.ApiException;
import com.avernet.myworkoutapi.exercise.ExerciseEntity;
import com.avernet.myworkoutapi.exercise.ExerciseNotFoundException;
import com.avernet.myworkoutapi.exercise.ExerciseRepository;
import com.avernet.myworkoutapi.gym.GymEntity;
import com.avernet.myworkoutapi.gym.GymRepository;
import com.avernet.myworkoutapi.history.HistoryEntity;
import com.avernet.myworkoutapi.history.HistoryRepository;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupEntity;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupNotFoundException;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupRepository;
import com.avernet.myworkoutapi.user.UpdateUser;
import com.avernet.myworkoutapi.user.User;
import com.avernet.myworkoutapi.user.UserEntity;
import com.avernet.myworkoutapi.user.UserNotFoundException;
import com.avernet.myworkoutapi.user.UserRepository;
import com.avernet.myworkoutapi.userexercise.UserExerciseEntity;
import com.avernet.myworkoutapi.userexercise.UserExerciseRepository;
import com.avernet.myworkoutapi.workout.WorkoutEntity;
import com.avernet.myworkoutapi.workout.WorkoutRepository;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
@Sql(scripts = "/data.sql")
public class AuthServiceTest {

    @Resource
    private AuthService service;

    @Resource
    private UserRepository userRepository;

    @Resource
    private JwtService jwtService;

    @Resource
    private GymRepository gymRepository;

    @Resource
    private WorkoutRepository workoutRepository;

    @Resource
    private HistoryRepository historyRepository;

    @Resource
    private UserExerciseRepository userExerciseRepository;

    @Resource
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Resource
    private MuscleGroupRepository muscleGroupRepository;

    @Resource
    private ExerciseRepository exerciseRepository;

    @Test
    void shouldLoginUser() {
        LoginRequest loginRequest = new LoginRequest("user1@gmail.com", "password123");

        AuthResponse authResponse = service.loginUser(loginRequest);
        assertNotNull(authResponse);
        assertNotNull(authResponse.accessToken());
        assertNotNull(authResponse.refreshToken());
    }

    @Test
    void shouldThrowBadCredentialExceptionIncorrectLogin() {
        LoginRequest loginRequest = new LoginRequest("user1@gmail.com", "password1234");

        assertThrows(BadCredentialsException.class, () -> service.loginUser(loginRequest));
    }

    @Test
    void shouldRegisterUser() {
        RegisterRequest registerRequest = new RegisterRequest("user3@gmail.com", "password123", "password123");
        User userCreated = service.registerUser(registerRequest);
        assertNotNull(userCreated);
        assertFalse(userCreated.getAdmin());
    }

    @Test
    void shouldThrowExceptionRegisterWithDifferentPasswords() {
        RegisterRequest registerRequest = new RegisterRequest("user3@gmail.com", "password123", "password1234");
        ApiException apiException = assertThrows(ApiException.class, () -> service.registerUser(registerRequest));
        assertNotNull(apiException);
        assertEquals(ErrorCodeEnum.PASSWORD_NOT_MATCH ,apiException.getErrorCode());
        assertEquals("Les mots de passes ne correspondent pas" ,apiException.getMessage());
        assertEquals(HttpStatus.BAD_REQUEST ,apiException.getHttpStatus());
    }

    @Test
    void shouldThrowExceptionExistingUserRegister() {
        RegisterRequest registerRequest = new RegisterRequest("user1@gmail.com", "password123", "password123");
        ApiException apiException = assertThrows(ApiException.class, () -> service.registerUser(registerRequest));
        assertEquals(ErrorCodeEnum.EMAIL_ALREADY_IN_USE, apiException.getErrorCode());
        assertEquals("Cet email est déjà utilisé", apiException.getMessage());
        assertEquals(HttpStatus.CONFLICT, apiException.getHttpStatus());
    }

    @Test
    void shouldGetRefreshToken() {
        LoginRequest loginRequest = new LoginRequest("user1@gmail.com", "password123");

        String refreshToken = service.loginUser(loginRequest).refreshToken();
        AuthResponse authResponse = service.refreshToken(refreshToken);
        assertNotNull(authResponse);
    }

    @Test
    void shouldThrowInvalidTokenWhenRefreshTokenExpired() {
        String expiredRefreshToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMTBAZ21haWwuY29tIiwiaWF0IjoxNzc1MzAyMjM5LCJleHAiOjF9.ccyVZ5s01zEZcLnhh4s6kgHOCAT7IJm7G7aSwtRHySY";
        assertInvalidToken(() -> service.refreshToken(expiredRefreshToken));
    }

    @Test
    void shouldThrowInvalidTokenWhenRefreshTokenMalformed() {
        assertInvalidToken(() -> service.refreshToken("not-a-jwt"));
    }

    @Test
    void shouldRejectAccessTokenOnRefresh() {
        String accessToken = service.loginUser(new LoginRequest("user1@gmail.com", "password123")).accessToken();

        assertInvalidToken(() -> service.refreshToken(accessToken));
    }

    @Test
    void shouldNotAcceptRefreshTokenAsAccessToken() {
        AuthResponse authResponse = service.loginUser(new LoginRequest("user1@gmail.com", "password123"));
        UserEntity userEntity = userRepository.findByEmail("user1@gmail.com").orElseThrow(UserNotFoundException::new);

        assertTrue(jwtService.isAccessTokenValid(authResponse.accessToken(), userEntity));
        assertFalse(jwtService.isAccessTokenValid(authResponse.refreshToken(), userEntity));
    }

    @Test
    void shouldRevokeExistingTokensWhenPasswordChanges() {
        AuthResponse tokensBeforeChange = service.loginUser(new LoginRequest("user1@gmail.com", "password123"));
        UserEntity userEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);

        service.update(userEntity, UpdateUser.builder().email(userEntity.getEmail()).password("newPassword123").confirmPassword("newPassword123").build());

        UserEntity updatedUserEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);
        assertFalse(jwtService.isAccessTokenValid(tokensBeforeChange.accessToken(), updatedUserEntity));
        assertInvalidToken(() -> service.refreshToken(tokensBeforeChange.refreshToken()));

        AuthResponse tokensAfterChange = service.loginUser(new LoginRequest("user1@gmail.com", "newPassword123"));
        assertTrue(jwtService.isAccessTokenValid(tokensAfterChange.accessToken(), updatedUserEntity));
    }

    @Test
    void shouldKeepTokensWhenNoCredentialChanges() {
        AuthResponse authResponse = service.loginUser(new LoginRequest("user1@gmail.com", "password123"));
        UserEntity userEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);

        service.update(userEntity, UpdateUser.builder().email(userEntity.getEmail()).build());

        UserEntity reloadedUserEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);
        assertTrue(jwtService.isAccessTokenValid(authResponse.accessToken(), reloadedUserEntity));
        assertNotNull(service.refreshToken(authResponse.refreshToken()));
    }

    @Test
    void shouldBlockLoginAfterTooManyFailedAttempts() {
        String email = "brute-force-target@gmail.com";
        service.registerUser(new RegisterRequest(email, "password123", "password123"));

        for (int i = 0; i < 5; i++) {
            assertThrows(BadCredentialsException.class, () -> service.loginUser(new LoginRequest(email, "wrongPassword")));
        }

        // Even the right password is refused while the account is locked
        ApiException apiException = assertThrows(ApiException.class, () -> service.loginUser(new LoginRequest(email, "password123")));
        assertEquals(ErrorCodeEnum.TOO_MANY_ATTEMPTS, apiException.getErrorCode());
        assertEquals(HttpStatus.TOO_MANY_REQUESTS, apiException.getHttpStatus());
    }

    @Test
    void shouldResetFailedAttemptsAfterSuccessfulLogin() {
        String email = "forgetful-user@gmail.com";
        service.registerUser(new RegisterRequest(email, "password123", "password123"));

        for (int i = 0; i < 4; i++) {
            assertThrows(BadCredentialsException.class, () -> service.loginUser(new LoginRequest(email, "wrongPassword")));
        }
        assertNotNull(service.loginUser(new LoginRequest(email, "password123")));

        for (int i = 0; i < 4; i++) {
            assertThrows(BadCredentialsException.class, () -> service.loginUser(new LoginRequest(email, "wrongPassword")));
        }
        assertNotNull(service.loginUser(new LoginRequest(email, "password123")));
    }

    @Test
    void shouldReportUnknownEmailAsBadCredentials() {
        assertThrows(BadCredentialsException.class, () -> service.loginUser(new LoginRequest("nobody@gmail.com", "password123")));
    }

    @Test
    void shouldDeleteUserWithAllTheirData() {
        UserEntity userEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);
        MuscleGroupEntity muscleGroupEntity = muscleGroupRepository.findById(1L).orElseThrow(MuscleGroupNotFoundException::new);
        ExerciseEntity exerciseEntity = exerciseRepository.findById(101L).orElseThrow(ExerciseNotFoundException::new);

        GymEntity gymEntity = gymRepository.save(GymEntity.builder().name("Salle 1").active(true).user(userEntity).build());
        WorkoutEntity workoutEntity = workoutRepository.save(WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .gym(gymEntity)
            .date(LocalDateTime.now())
            .build());
        HistoryEntity historyEntity = historyRepository.save(HistoryEntity.builder()
            .exercise(exerciseEntity)
            .workout(workoutEntity)
            .weight(50F)
            .reps((short) 10)
            .unilateral(false)
            .build());
        UserExerciseEntity userExerciseEntity = userExerciseRepository.save(UserExerciseEntity.builder()
            .user(userEntity)
            .exercise(exerciseEntity)
            .order(1)
            .build());
        PasswordResetTokenEntity passwordResetTokenEntity = passwordResetTokenRepository.save(PasswordResetTokenEntity.builder()
            .token("token-of-deleted-user")
            .user(userEntity)
            .used(false)
            .expirationDate(LocalDateTime.now().plusMinutes(15))
            .build());

        // Same shape as the controller's principal: detached, collections never loaded
        assertDoesNotThrow(() -> service.deleteUser(userEntity));

        assertFalse(userRepository.existsById(1L));
        assertFalse(gymRepository.existsById(gymEntity.getId()));
        assertFalse(workoutRepository.existsById(workoutEntity.getId()));
        assertFalse(historyRepository.existsById(historyEntity.getId()));
        assertFalse(userExerciseRepository.existsById(userExerciseEntity.getId()));
        assertFalse(passwordResetTokenRepository.existsById(passwordResetTokenEntity.getId()));
        assertTrue(userRepository.existsById(2L));
    }

    private static void assertInvalidToken(Executable executable) {
        ApiException apiException = assertThrows(ApiException.class, executable);
        assertEquals(ErrorCodeEnum.INVALID_TOKEN, apiException.getErrorCode());
        assertEquals(HttpStatus.UNAUTHORIZED, apiException.getHttpStatus());
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

    @Test
    void shouldNotReturnOptionalUser() {
        Optional<UserEntity> optionalUser = service.optionalUser();
        assertFalse(optionalUser.isPresent());
    }
}

package com.avernet.myworkoutapi;

import com.avernet.myworkoutapi.auth.JwtService;
import com.avernet.myworkoutapi.exercise.ExerciseEntity;
import com.avernet.myworkoutapi.exercise.ExerciseNotFoundException;
import com.avernet.myworkoutapi.exercise.ExerciseRepository;
import com.avernet.myworkoutapi.gemini.GeminiService;
import com.avernet.myworkoutapi.gym.GymEntity;
import com.avernet.myworkoutapi.gym.GymRepository;
import com.avernet.myworkoutapi.history.HistoryEntity;
import com.avernet.myworkoutapi.history.HistoryRepository;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupEntity;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupNotFoundException;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupRepository;
import com.avernet.myworkoutapi.user.UserEntity;
import com.avernet.myworkoutapi.user.UserNotFoundException;
import com.avernet.myworkoutapi.user.UserRepository;
import com.avernet.myworkoutapi.workout.WorkoutEntity;
import com.avernet.myworkoutapi.workout.WorkoutRepository;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.assertj.MockMvcTester;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

/**
 * Goes through the real HTTP stack (security filter chain, JWT filter, argument resolution,
 * validation, exception handler): the service tests call Java methods directly and can't see
 * any of it.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
@Sql(scripts = "/data.sql")
class ApiSecurityTest {

    @Resource
    private MockMvcTester mvc;

    @Resource
    private JwtService jwtService;

    @Resource
    private UserRepository userRepository;

    @Resource
    private GymRepository gymRepository;

    @Resource
    private WorkoutRepository workoutRepository;

    @Resource
    private HistoryRepository historyRepository;

    @Resource
    private MuscleGroupRepository muscleGroupRepository;

    @Resource
    private ExerciseRepository exerciseRepository;

    @MockitoBean
    private GeminiService geminiService;

    private UserEntity user;
    private UserEntity otherUser;
    private UserEntity admin;

    @BeforeEach
    void setUp() {
        user = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);
        otherUser = userRepository.findById(2L).orElseThrow(UserNotFoundException::new);
        admin = userRepository.findById(3L).orElseThrow(UserNotFoundException::new);
    }

    // --- Public routes ---

    @Test
    void publicExerciseRoutesShouldNotRequireAuthentication() {
        assertThat(mvc.get().uri("/exercises")).hasStatusOk();
        assertThat(mvc.get().uri("/exercises/101")).hasStatusOk();
        assertThat(mvc.get().uri("/exercises/search").param("search", "curl")).hasStatusOk();
        assertThat(mvc.get().uri("/exercises/muscle-group/1")).hasStatusOk();
        assertThat(mvc.get().uri("/muscle-group")).hasStatusOk();
    }

    @Test
    void protectedRoutesShouldAnswer401WithoutToken() {
        assertThat(mvc.get().uri("/gym")).hasStatus(HttpStatus.UNAUTHORIZED);
        assertThat(mvc.get().uri("/workout/1")).hasStatus(HttpStatus.UNAUTHORIZED);
        assertThat(mvc.get().uri("/auth/me")).hasStatus(HttpStatus.UNAUTHORIZED);
        assertThat(mvc.get().uri("/exercises/user/cardio")).hasStatus(HttpStatus.UNAUTHORIZED);
    }

    // --- Gemini endpoint: must never be reachable through the public /exercises/{id} pattern ---

    @Test
    void exerciseDescriptionShouldRequireAuthentication() {
        assertThat(mvc.get().uri("/exercises/description").param("exerciseName", "Squat"))
            .hasStatus(HttpStatus.UNAUTHORIZED);
        verifyNoInteractions(geminiService);
    }

    @Test
    void exerciseDescriptionShouldBeForbiddenToNonAdmin() {
        assertThat(mvc.get().uri("/exercises/description").param("exerciseName", "Squat").header(HttpHeaders.AUTHORIZATION, bearer(user)))
            .hasStatus(HttpStatus.FORBIDDEN);
        verifyNoInteractions(geminiService);
    }

    @Test
    void exerciseDescriptionShouldWorkForAdmin() {
        when(geminiService.generatePrompt(anyString())).thenReturn("1. Placez-vous debout.");

        assertThat(mvc.get().uri("/exercises/description").param("exerciseName", "Squat").header(HttpHeaders.AUTHORIZATION, bearer(admin)))
            .hasStatusOk()
            .bodyJson().extractingPath("$.description").isEqualTo("1. Placez-vous debout.");
    }

    @Test
    void exerciseDescriptionShouldRejectOversizedExerciseName() {
        assertThat(mvc.get().uri("/exercises/description").param("exerciseName", "x".repeat(41)).header(HttpHeaders.AUTHORIZATION, bearer(admin)))
            .hasStatus(HttpStatus.BAD_REQUEST)
            .bodyJson().extractingPath("$.type").isEqualTo("VALIDATION");
        verifyNoInteractions(geminiService);
    }

    @Test
    void createExerciseShouldBeForbiddenToNonAdmin() {
        assertThat(mvc.post().uri("/exercises").header(HttpHeaders.AUTHORIZATION, bearer(user))
            .contentType(MediaType.APPLICATION_JSON).content("{}"))
            .hasStatus(HttpStatus.FORBIDDEN);
    }

    // --- JWT ---

    @Test
    void refreshTokenShouldNotBeAcceptedAsAccessToken() {
        String refreshToken = jwtService.generateRefreshToken(user);

        assertThat(mvc.get().uri("/auth/me").header(HttpHeaders.AUTHORIZATION, "Bearer " + refreshToken))
            .hasStatus(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void accessTokenShouldNotBeAcceptedOnRefresh() {
        String accessToken = jwtService.generateAccessToken(user);

        assertThat(mvc.post().uri("/auth/refresh").contentType(MediaType.TEXT_PLAIN).content(accessToken))
            .hasStatus(HttpStatus.UNAUTHORIZED)
            .bodyJson().extractingPath("$.errorCode").isEqualTo("INVALID_TOKEN");
    }

    @Test
    void refreshTokenShouldIssueNewTokens() {
        String refreshToken = jwtService.generateRefreshToken(user);

        assertThat(mvc.post().uri("/auth/refresh").contentType(MediaType.TEXT_PLAIN).content(refreshToken))
            .hasStatusOk()
            .bodyJson().extractingPath("$.accessToken").isNotNull();
    }

    @Test
    void tokenShouldBeRejectedOnceUserChangedPassword() {
        String tokenBeforeChange = bearer(user);

        assertThat(mvc.patch().uri("/auth").header(HttpHeaders.AUTHORIZATION, tokenBeforeChange)
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {"email": "user1@gmail.com", "password": "newPassword123", "confirmPassword": "newPassword123"}
                """))
            .hasStatusOk();

        assertThat(mvc.get().uri("/auth/me").header(HttpHeaders.AUTHORIZATION, tokenBeforeChange))
            .hasStatus(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void malformedTokenShouldBeTreatedAsAnonymous() {
        assertThat(mvc.get().uri("/gym").header(HttpHeaders.AUTHORIZATION, "Bearer not-a-jwt"))
            .hasStatus(HttpStatus.UNAUTHORIZED);
        assertThat(mvc.get().uri("/exercises").header(HttpHeaders.AUTHORIZATION, "Bearer not-a-jwt"))
            .hasStatusOk();
    }

    // --- Login ---

    @Test
    void loginWithWrongPasswordShouldAnswer401() {
        assertThat(login("user1@gmail.com", "wrongPassword"))
            .hasStatus(HttpStatus.UNAUTHORIZED)
            .bodyJson().extractingPath("$.errorCode").isEqualTo("INVALID_CREDENTIALS");
    }

    @Test
    void loginWithUnknownEmailShouldAnswerLikeWrongPassword() {
        assertThat(login("nobody@gmail.com", "password123"))
            .hasStatus(HttpStatus.UNAUTHORIZED)
            .bodyJson().extractingPath("$.errorCode").isEqualTo("INVALID_CREDENTIALS");
    }

    @Test
    void loginShouldBeLockedAfterTooManyFailures() {
        String email = "http-brute-force@gmail.com";
        for (int i = 0; i < 5; i++) {
            assertThat(login(email, "wrongPassword")).hasStatus(HttpStatus.UNAUTHORIZED);
        }

        assertThat(login(email, "wrongPassword"))
            .hasStatus(HttpStatus.TOO_MANY_REQUESTS)
            .bodyJson().extractingPath("$.errorCode").isEqualTo("TOO_MANY_ATTEMPTS");
    }

    // --- Account ---

    @Test
    void updateAccountShouldNotNeedAnIdInTheUrl() {
        assertThat(mvc.patch().uri("/auth").header(HttpHeaders.AUTHORIZATION, bearer(user))
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {"email": "renamed@gmail.com"}
                """))
            .hasStatusOk()
            .bodyJson().extractingPath("$.email").isEqualTo("renamed@gmail.com");
    }

    @Test
    void deleteAccountShouldWorkForUserWithGymAndWorkouts() {
        GymEntity gym = saveGym(user);
        saveHistory(saveWorkout(user, gym), 50F);

        assertThat(mvc.delete().uri("/auth").header(HttpHeaders.AUTHORIZATION, bearer(user))).hasStatusOk();

        assertThat(userRepository.existsById(user.getId())).isFalse();
    }

    // --- IDOR: user 1 must never reach user 2's data ---

    @Test
    void shouldNotReadAnotherUsersWorkout() {
        WorkoutEntity otherWorkout = saveWorkout(otherUser, saveGym(otherUser));

        assertThat(mvc.get().uri("/workout/{id}", otherWorkout.getId()).header(HttpHeaders.AUTHORIZATION, bearer(user)))
            .hasStatus(HttpStatus.NOT_FOUND)
            .bodyJson().extractingPath("$.errorCode").isEqualTo("WORKOUT_NOT_FOUND");
    }

    @Test
    void shouldNotDeleteAnotherUsersWorkout() {
        WorkoutEntity otherWorkout = saveWorkout(otherUser, saveGym(otherUser));

        mvc.delete().uri("/workout/{id}", otherWorkout.getId()).header(HttpHeaders.AUTHORIZATION, bearer(user)).exchange();

        assertThat(workoutRepository.existsById(otherWorkout.getId())).isTrue();
    }

    @Test
    void shouldNotUpdateOrDeleteAnotherUsersHistory() {
        HistoryEntity otherHistory = saveHistory(saveWorkout(otherUser, saveGym(otherUser)), 50F);

        assertThat(mvc.patch().uri("/history/{id}", otherHistory.getId()).header(HttpHeaders.AUTHORIZATION, bearer(user))
            .contentType(MediaType.APPLICATION_JSON).content("{\"weight\": 999}"))
            .hasStatus(HttpStatus.NOT_FOUND);
        assertThat(mvc.delete().uri("/history/{id}", otherHistory.getId()).header(HttpHeaders.AUTHORIZATION, bearer(user)))
            .hasStatus(HttpStatus.NOT_FOUND);

        assertThat(historyRepository.findById(otherHistory.getId()).orElseThrow().getWeight()).isEqualTo(50F);
    }

    @Test
    void shouldNotUpdateOrDeleteAnotherUsersGym() {
        GymEntity otherGym = saveGym(otherUser);

        assertThat(mvc.patch().uri("/gym/{id}", otherGym.getId()).header(HttpHeaders.AUTHORIZATION, bearer(user))
            .contentType(MediaType.APPLICATION_JSON).content("{\"name\": \"Piratée\"}"))
            .hasStatus(HttpStatus.NOT_FOUND);
        assertThat(mvc.delete().uri("/gym/{id}", otherGym.getId()).header(HttpHeaders.AUTHORIZATION, bearer(user)))
            .hasStatus(HttpStatus.NOT_FOUND);

        GymEntity reloaded = gymRepository.findById(otherGym.getId()).orElseThrow();
        assertThat(reloaded.getName()).isEqualTo("Salle");
        assertThat(reloaded.getActive()).isTrue();
    }

    @Test
    void shouldNotSeeAnotherUsersHistoryInGraphs() {
        saveHistory(saveWorkout(otherUser, saveGym(otherUser)), 80F);

        assertThat(mvc.get().uri("/history/exercise-graph/101").header(HttpHeaders.AUTHORIZATION, bearer(user)))
            .hasStatusOk()
            .bodyJson().extractingPath("$.maxWeight").isNull();
    }

    // --- Error contract ---

    @Test
    void malformedDateShouldAnswer400InsteadOf500() {
        assertThat(mvc.get().uri("/workout/date").param("start", "not-a-date").param("end", "2026-01-01")
            .header(HttpHeaders.AUTHORIZATION, bearer(user)))
            .hasStatus(HttpStatus.BAD_REQUEST)
            .bodyJson().extractingPath("$.errorCode").isEqualTo("INVALID_REQUEST");
    }

    @Test
    void unknownRouteShouldAnswer404WithApiFormat() {
        assertThat(mvc.get().uri("/does-not-exist").header(HttpHeaders.AUTHORIZATION, bearer(user)))
            .hasStatus(HttpStatus.NOT_FOUND)
            .bodyJson().extractingPath("$.errorCode").isEqualTo("RESOURCE_NOT_FOUND");
    }

    @Test
    void unexpectedErrorShouldAnswerGeneric500WithoutDetails() {
        when(geminiService.generatePrompt(anyString())).thenThrow(new IllegalStateException("internal detail that must not leak"));

        assertThat(mvc.get().uri("/exercises/description").param("exerciseName", "Squat").header(HttpHeaders.AUTHORIZATION, bearer(admin)))
            .hasStatus(HttpStatus.INTERNAL_SERVER_ERROR)
            .bodyJson()
            .satisfies(json -> assertThat(json.getJson()).doesNotContain("internal detail"))
            .extractingPath("$.errorCode").isEqualTo("INTERNAL_ERROR");
    }

    @Test
    void forgotPasswordShouldValidateEmail() {
        assertThat(mvc.get().uri("/password-reset-token/forgot-password").param("email", "not-an-email"))
            .hasStatus(HttpStatus.BAD_REQUEST)
            .bodyJson().extractingPath("$.errors[0].field").isEqualTo("email");
    }

    @Test
    void resetPasswordShouldRejectTooShortPassword() {
        assertThat(mvc.post().uri("/password-reset-token/reset-password")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {"token": "some-token", "password": "123"}
                """))
            .hasStatus(HttpStatus.BAD_REQUEST)
            .bodyJson().extractingPath("$.errors[0].field").isEqualTo("password");
    }

    private MockMvcTester.MockMvcRequestBuilder login(String email, String password) {
        return mvc.post().uri("/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {"email": "%s", "password": "%s"}
                """.formatted(email, password));
    }

    private String bearer(UserEntity userEntity) {
        return "Bearer " + jwtService.generateAccessToken(userEntity);
    }

    private GymEntity saveGym(UserEntity owner) {
        return gymRepository.save(GymEntity.builder().name("Salle").active(true).user(owner).build());
    }

    private WorkoutEntity saveWorkout(UserEntity owner, GymEntity gym) {
        MuscleGroupEntity muscleGroup = muscleGroupRepository.findById(1L).orElseThrow(MuscleGroupNotFoundException::new);
        return workoutRepository.save(WorkoutEntity.builder()
            .user(owner)
            .muscleGroup(muscleGroup)
            .gym(gym)
            .date(LocalDateTime.now())
            .build());
    }

    private HistoryEntity saveHistory(WorkoutEntity workout, float weight) {
        ExerciseEntity exercise = exerciseRepository.findById(101L).orElseThrow(ExerciseNotFoundException::new);
        return historyRepository.save(HistoryEntity.builder()
            .exercise(exercise)
            .workout(workout)
            .weight(weight)
            .reps((short) 10)
            .unilateral(false)
            .build());
    }
}

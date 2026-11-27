package com.avernet.myworkoutapi;

import com.avernet.myworkoutapi.exception.ApiException;
import com.avernet.myworkoutapi.error.ErrorCodeEnum;
import com.avernet.myworkoutapi.exercise.ExerciseNotFoundException;
import com.avernet.myworkoutapi.gym.GymEntity;
import com.avernet.myworkoutapi.gym.GymRepository;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupNotFoundException;
import com.avernet.myworkoutapi.user.UserNotFoundException;
import com.avernet.myworkoutapi.exercise.ExerciseEntity;
import com.avernet.myworkoutapi.exercise.ExerciseRepository;
import com.avernet.myworkoutapi.history.History;
import com.avernet.myworkoutapi.history.HistoryEntity;
import com.avernet.myworkoutapi.history.HistoryMapper;
import com.avernet.myworkoutapi.history.HistoryRepository;
import com.avernet.myworkoutapi.history.HistoryService;
import com.avernet.myworkoutapi.history.stats.UserExercisesCountTotalWorkout;
import com.avernet.myworkoutapi.history.stats.exercisegraphs.ExerciseGraphs;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupEntity;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupRepository;
import com.avernet.myworkoutapi.user.UserEntity;
import com.avernet.myworkoutapi.user.UserRepository;
import com.avernet.myworkoutapi.userexercise.UserExerciseEntity;
import com.avernet.myworkoutapi.userexercise.UserExerciseRepository;
import com.avernet.myworkoutapi.workout.WorkoutEntity;
import com.avernet.myworkoutapi.workout.WorkoutRepository;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
@Sql(scripts = "/data.sql")
public class HistoryServiceTest {

    @Resource
    private HistoryService service;

    @Resource
    private UserRepository userRepository;

    @Resource
    private ExerciseRepository exerciseRepository;

    @Resource
    private WorkoutRepository workoutRepository;

    @Resource
    private HistoryRepository historyRepository;

    @Resource
    private MuscleGroupRepository muscleGroupRepository;

    @Resource
    private UserExerciseRepository userExerciseRepository;

    @Resource
    private HistoryMapper historyMapper;

    @Resource
    private GymRepository gymRepository;


    UserEntity userEntity;
    ExerciseEntity exerciseEntity;
    MuscleGroupEntity muscleGroupEntity;
    GymEntity gymEntity;

    @BeforeEach
    void setup() {
        userEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);
        exerciseEntity = exerciseRepository.findById(1L).orElseThrow(ExerciseNotFoundException::new);
        muscleGroupEntity = muscleGroupRepository.findById(1L).orElseThrow(MuscleGroupNotFoundException::new);
        // gym_id is NOT NULL on workout: every test needs one to attach, by default.
        gymEntity = gymRepository.save(GymEntity.builder().name("Salle par défaut").active(true).user(userEntity).build());
    }


    @Test
    void shouldFindLastHistory() {
        for (int i = 1; i < 4; i++) {
            WorkoutEntity w = WorkoutEntity.builder()
                .user(userEntity)
                .muscleGroup(muscleGroupEntity)
                .gym(gymEntity)
                .date(LocalDateTime.of(2026, 1, i, 0, 0))
                .build();
            WorkoutEntity workoutEntity = workoutRepository.save(w);

            for (int j = 1; j < 5; j++) {
                HistoryEntity historyEntity = HistoryEntity.builder()
                    .exercise(exerciseEntity)
                    .reps((short) 10)
                    .weight(50F + i + j)
                    .unilateral(true)
                    .workout(workoutEntity)
                    .build();
                historyRepository.save(historyEntity);
            }
        }

        History history = service.findLastHistoryWeightByExerciseId(userEntity, exerciseEntity.getId(), null);
        assertNotNull(history);
        assertEquals(54F, history.getWeight());
    }

    @Test
    void shouldPreferLastHistoryForTheSameGym() {
        GymEntity gymA = gymRepository.save(GymEntity.builder().name("Salle A").active(true).user(userEntity).build());
        GymEntity gymB = gymRepository.save(GymEntity.builder().name("Salle B").active(true).user(userEntity).build());

        WorkoutEntity workoutGymA = workoutRepository.save(WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .gym(gymA)
            .date(LocalDateTime.of(2026, 1, 1, 0, 0))
            .build());
        historyRepository.save(HistoryEntity.builder()
            .exercise(exerciseEntity)
            .reps((short) 10)
            .weight(40F)
            .unilateral(true)
            .workout(workoutGymA)
            .build());

        WorkoutEntity workoutGymB = workoutRepository.save(WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .gym(gymB)
            .date(LocalDateTime.of(2026, 1, 2, 0, 0))
            .build());
        historyRepository.save(HistoryEntity.builder()
            .exercise(exerciseEntity)
            .reps((short) 10)
            .weight(60F)
            .unilateral(true)
            .workout(workoutGymB)
            .build());

        History lastForGymA = service.findLastHistoryWeightByExerciseId(userEntity, exerciseEntity.getId(), gymA.getId());
        assertNotNull(lastForGymA);
        assertEquals(40F, lastForGymA.getWeight());

        History lastForGymB = service.findLastHistoryWeightByExerciseId(userEntity, exerciseEntity.getId(), gymB.getId());
        assertNotNull(lastForGymB);
        assertEquals(60F, lastForGymB.getWeight());

        History lastAnyGym = service.findLastHistoryWeightByExerciseId(userEntity, exerciseEntity.getId(), null);
        assertNotNull(lastAnyGym);
        assertEquals(60F, lastAnyGym.getWeight());
    }

    @Test
    void shouldFallBackToAnyGymWhenNoneForTheSelectedGym() {
        // Reproduces the real bug: a lot of history recorded under one gym (e.g. the
        // "Salle 1" the migration auto-created), and a brand new second gym with no
        // history yet. Selecting that new gym must still suggest the last weight/reps
        // instead of leaving the pre-fill empty.
        GymEntity gymWithHistory = gymRepository.save(GymEntity.builder().name("Salle 1").active(true).user(userEntity).build());
        GymEntity emptyGym = gymRepository.save(GymEntity.builder().name("Salle 2").active(true).user(userEntity).build());

        WorkoutEntity workoutEntity = workoutRepository.save(WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .gym(gymWithHistory)
            .date(LocalDateTime.of(2026, 1, 1, 0, 0))
            .build());
        historyRepository.save(HistoryEntity.builder()
            .exercise(exerciseEntity)
            .reps((short) 10)
            .weight(70F)
            .unilateral(true)
            .workout(workoutEntity)
            .build());

        History lastForEmptyGym = service.findLastHistoryWeightByExerciseId(userEntity, exerciseEntity.getId(), emptyGym.getId());
        assertNotNull(lastForEmptyGym);
        assertEquals(70F, lastForEmptyGym.getWeight());
    }

    @Test
    void shouldFindTodayHistories() {
        WorkoutEntity w = WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .gym(gymEntity)
            .date(LocalDateTime.now())
            .build();
        WorkoutEntity workoutEntity = workoutRepository.save(w);

        HistoryEntity historyEntity = HistoryEntity.builder()
            .exercise(exerciseEntity)
            .reps((short) 10)
            .weight(50F)
            .unilateral(true)
            .workout(workoutEntity)
            .build();
        historyRepository.save(historyEntity);

        List<History> history = service.findTodayHistories(userEntity, muscleGroupEntity.getId().longValue(), exerciseEntity.getId(), null);
        assertNotNull(history);
        assertFalse(history.isEmpty());
        assertEquals(1, history.size());
    }

    @Test
    void shouldFindTodayHistoriesFilteredByGym() {
        GymEntity gymA = gymRepository.save(GymEntity.builder().name("Salle A").active(true).user(userEntity).build());
        GymEntity gymB = gymRepository.save(GymEntity.builder().name("Salle B").active(true).user(userEntity).build());

        WorkoutEntity workoutGymA = workoutRepository.save(WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .gym(gymA)
            .date(LocalDateTime.now())
            .build());
        historyRepository.save(HistoryEntity.builder()
            .exercise(exerciseEntity)
            .reps((short) 10)
            .weight(50F)
            .unilateral(true)
            .workout(workoutGymA)
            .build());

        WorkoutEntity workoutGymB = workoutRepository.save(WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .gym(gymB)
            .date(LocalDateTime.now())
            .build());
        historyRepository.save(HistoryEntity.builder()
            .exercise(exerciseEntity)
            .reps((short) 10)
            .weight(80F)
            .unilateral(true)
            .workout(workoutGymB)
            .build());

        List<History> historyGymA = service.findTodayHistories(userEntity, muscleGroupEntity.getId().longValue(), exerciseEntity.getId(), gymA.getId());
        assertEquals(1, historyGymA.size());
        assertEquals(50F, historyGymA.getFirst().getWeight());

        List<History> historyGymB = service.findTodayHistories(userEntity, muscleGroupEntity.getId().longValue(), exerciseEntity.getId(), gymB.getId());
        assertEquals(1, historyGymB.size());
        assertEquals(80F, historyGymB.getFirst().getWeight());

        List<History> historyAnyGym = service.findTodayHistories(userEntity, muscleGroupEntity.getId().longValue(), exerciseEntity.getId(), null);
        assertEquals(2, historyAnyGym.size());
    }

    @Test
    void shouldNotFindHistoriesFromOthersDays() {
        WorkoutEntity w = WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .gym(gymEntity)
            .date(LocalDateTime.of(2026, 1, 1, 0, 0))
            .build();
        WorkoutEntity workoutEntity = workoutRepository.save(w);

        HistoryEntity historyEntity = HistoryEntity.builder()
            .exercise(exerciseEntity)
            .reps((short) 10)
            .weight(50F)
            .unilateral(true)
            .workout(workoutEntity)
            .build();
        historyRepository.save(historyEntity);

        List<History> history = service.findTodayHistories(userEntity, muscleGroupEntity.getId().longValue(), exerciseEntity.getId(), null);
        assertTrue(history.isEmpty());
    }

    @Test
    void shouldFindStats() {
        for (int i = 1; i <= 9; i++) {
            ExerciseEntity exercise = exerciseRepository.findById((long) i).orElseThrow(ExerciseNotFoundException::new);
            UserExerciseEntity userExerciseEntity = UserExerciseEntity.builder()
                .exercise(exercise)
                .user(userEntity)
                .build();
            userExerciseRepository.save(userExerciseEntity);
        }

        for (int i = 1; i <= 5; i++) {
            WorkoutEntity workoutEntity = WorkoutEntity.builder()
                .user(userEntity)
                .muscleGroup(muscleGroupEntity)
                .gym(gymEntity)
                .date(LocalDateTime.of(2026, 1, i, 0, 0))
                .build();
            workoutRepository.save(workoutEntity);
        }


        UserExercisesCountTotalWorkout userExercisesCountTotalWorkout = service.getGlobalStatsWithListExercises(userEntity);
        assertNotNull(userExercisesCountTotalWorkout);
        assertEquals(9, userExercisesCountTotalWorkout.exercises().size());
        assertFalse(userExercisesCountTotalWorkout.exercises().isEmpty());
        assertEquals(5, userExercisesCountTotalWorkout.countTotalDaysWorkout());
    }

    @Test
    void shouldFindDataForGraph() {
        for (int i = 1; i <= 3; i++) {
            WorkoutEntity w = WorkoutEntity.builder()
                .user(userEntity)
                .muscleGroup(muscleGroupEntity)
                .gym(gymEntity)
                .date(LocalDateTime.of(20226, 1, i, 0, 0))
                .build();
            WorkoutEntity workoutEntity = workoutRepository.save(w);

            for (int j = 1; j <= 5; j++) {
                HistoryEntity historyEntity = HistoryEntity.builder()
                    .exercise(exerciseEntity)
                    .reps((short) 10)
                    .weight(50F + j)
                    .unilateral(true)
                    .workout(workoutEntity)
                    .build();
                historyRepository.save(historyEntity);
            }
        }

        ExerciseGraphs exerciseGraphs = service.getExerciseGraphs(userEntity, exerciseEntity.getId(), null);
        assertNotNull(exerciseGraphs);
        assertEquals(55F, exerciseGraphs.maxWeight());
        assertEquals(795, exerciseGraphs.totalWeight());
        assertEquals(150, exerciseGraphs.totalReps());
    }

    @Test
    void shouldReturnEmptyGraphForExerciseNeverLogged() {
        ExerciseGraphs exerciseGraphs = service.getExerciseGraphs(userEntity, exerciseEntity.getId(), null);

        assertEquals(exerciseEntity.getId(), exerciseGraphs.exercise().getId());
        assertTrue(exerciseGraphs.historyPoints().isEmpty());
        assertNull(exerciseGraphs.totalWeight());
        assertNull(exerciseGraphs.maxWeight());
        assertNull(exerciseGraphs.totalReps());
    }

    @Test
    void shouldIgnoreMissingWeightAndRepsInGraphTotals() {
        WorkoutEntity workoutEntity = workoutRepository.save(WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .gym(gymEntity)
            .date(LocalDateTime.of(2026, 1, 1, 0, 0))
            .build());
        historyRepository.save(HistoryEntity.builder().exercise(exerciseEntity).workout(workoutEntity).weight(40F).reps((short) 8).unilateral(false).build());
        historyRepository.save(HistoryEntity.builder().exercise(exerciseEntity).workout(workoutEntity).weight(null).reps(null).unilateral(false).build());

        ExerciseGraphs exerciseGraphs = service.getExerciseGraphs(userEntity, exerciseEntity.getId(), null);

        assertEquals(40, exerciseGraphs.totalWeight());
        assertEquals(40F, exerciseGraphs.maxWeight());
        assertEquals(8, exerciseGraphs.totalReps());
    }

    @Test
    void shouldReturnNullWeightTotalsWhenNoWeightLogged() {
        WorkoutEntity workoutEntity = workoutRepository.save(WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .gym(gymEntity)
            .date(LocalDateTime.of(2026, 1, 1, 0, 0))
            .build());
        historyRepository.save(HistoryEntity.builder().exercise(exerciseEntity).workout(workoutEntity).weight(null).reps((short) 12).unilateral(false).build());

        ExerciseGraphs exerciseGraphs = service.getExerciseGraphs(userEntity, exerciseEntity.getId(), null);

        assertNull(exerciseGraphs.totalWeight());
        assertNull(exerciseGraphs.maxWeight());
        assertEquals(12, exerciseGraphs.totalReps());
    }

    @Test
    void shouldThrowWhenGraphRequestedForUnknownExercise() {
        assertThrows(ExerciseNotFoundException.class, () -> service.getExerciseGraphs(userEntity, 999_999L, null));
    }

    @Test
    void shouldFindDataForGraphFilteredByGym() {
        GymEntity gymA = gymRepository.save(GymEntity.builder().name("Salle A").active(true).user(userEntity).build());
        GymEntity gymB = gymRepository.save(GymEntity.builder().name("Salle B").active(true).user(userEntity).build());

        WorkoutEntity workoutGymA = workoutRepository.save(WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .gym(gymA)
            .date(LocalDateTime.of(2026, 1, 1, 0, 0))
            .build());
        historyRepository.save(HistoryEntity.builder()
            .exercise(exerciseEntity)
            .reps((short) 10)
            .weight(50F)
            .unilateral(true)
            .workout(workoutGymA)
            .build());

        WorkoutEntity workoutGymB = workoutRepository.save(WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .gym(gymB)
            .date(LocalDateTime.of(2026, 1, 2, 0, 0))
            .build());
        historyRepository.save(HistoryEntity.builder()
            .exercise(exerciseEntity)
            .reps((short) 20)
            .weight(80F)
            .unilateral(true)
            .workout(workoutGymB)
            .build());

        ExerciseGraphs graphsGymA = service.getExerciseGraphs(userEntity, exerciseEntity.getId(), gymA.getId());
        assertEquals(50F, graphsGymA.maxWeight());
        assertEquals(10, graphsGymA.totalReps());

        ExerciseGraphs graphsGymB = service.getExerciseGraphs(userEntity, exerciseEntity.getId(), gymB.getId());
        assertEquals(80F, graphsGymB.maxWeight());
        assertEquals(20, graphsGymB.totalReps());

        ExerciseGraphs graphsAnyGym = service.getExerciseGraphs(userEntity, exerciseEntity.getId(), null);
        assertEquals(80F, graphsAnyGym.maxWeight());
        assertEquals(30, graphsAnyGym.totalReps());
    }

    @Test
    void shouldAggregateOneHistoryPointPerDay() {
        WorkoutEntity day1 = workoutRepository.save(WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .gym(gymEntity)
            .date(LocalDateTime.of(2026, 1, 1, 0, 0))
            .build());

        for (Float weight : new Float[] { 50F, 52F, 48F }) {
            historyRepository.save(HistoryEntity.builder()
                .exercise(exerciseEntity)
                .reps((short) 10)
                .weight(weight)
                .unilateral(true)
                .workout(day1)
                .build());
        }

        WorkoutEntity day2 = workoutRepository.save(WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .gym(gymEntity)
            .date(LocalDateTime.of(2026, 1, 2, 0, 0))
            .build());

        historyRepository.save(HistoryEntity.builder()
            .exercise(exerciseEntity)
            .reps((short) 10)
            .weight(55F)
            .unilateral(true)
            .workout(day2)
            .build());

        ExerciseGraphs exerciseGraphs = service.getExerciseGraphs(userEntity, exerciseEntity.getId(), null);

        assertEquals(2, exerciseGraphs.historyPoints().size());
        assertEquals(52F, exerciseGraphs.historyPoints().get(0).weight());
        assertEquals(55F, exerciseGraphs.historyPoints().get(1).weight());
    }

    @Test
    void shouldUpdateHistory() {
        WorkoutEntity w = WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .gym(gymEntity)
            .date(LocalDateTime.now())
            .build();
        WorkoutEntity workoutEntity = workoutRepository.save(w);

        HistoryEntity historyEntity = HistoryEntity.builder()
            .exercise(exerciseEntity)
            .reps((short) 10)
            .weight(50F)
            .unilateral(true)
            .workout(workoutEntity)
            .build();
        historyRepository.save(historyEntity);


        History historyToUpdate = historyMapper.toDto(historyEntity);
        historyToUpdate.setReps((short) 12);
        historyToUpdate.setWeight(60F);

        History updatedHistory = service.update(userEntity, historyToUpdate.getId(), historyToUpdate);
        HistoryEntity historyUpdated = historyRepository.findById(historyToUpdate.getId())
            .orElseThrow(() -> new ApiException(ErrorCodeEnum.HISTORY_NOT_FOUND, "Cet historique n'existe pas", HttpStatus.NOT_FOUND));

        assertNotNull(updatedHistory);
        assertEquals((short) 12, updatedHistory.getReps());
        assertEquals(60F, updatedHistory.getWeight());

        assertNotNull(historyUpdated);
        assertEquals((short) 12, historyUpdated.getReps());
        assertEquals(60F, historyUpdated.getWeight());
    }

    @Test
    void shouldThrowExceptionHistoryNotExistUpdateHistory() {
        WorkoutEntity w = WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .gym(gymEntity)
            .date(LocalDateTime.now())
            .build();
        WorkoutEntity workoutEntity = workoutRepository.save(w);

        HistoryEntity historyEntity = HistoryEntity.builder()
            .exercise(exerciseEntity)
            .reps((short) 10)
            .weight(50F)
            .unilateral(true)
            .workout(workoutEntity)
            .build();
        historyRepository.save(historyEntity);


        History historyToUpdate = historyMapper.toDto(historyEntity);
        historyToUpdate.setId(2L);
        historyToUpdate.setReps((short) 12);
        historyToUpdate.setWeight(60F);

        ApiException exception = assertThrows(ApiException.class, () -> service.update(userEntity, historyToUpdate.getId(), historyToUpdate));
        assertEquals("Cet historique n'existe pas", exception.getMessage());
        assertEquals(ErrorCodeEnum.HISTORY_NOT_FOUND, exception.getErrorCode());
        assertEquals(HttpStatus.NOT_FOUND, exception.getHttpStatus());
    }

    @Test
    void shouldNotUpdateOrDeleteAnotherUsersHistory() {
        WorkoutEntity w = WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .gym(gymEntity)
            .date(LocalDateTime.now())
            .build();
        WorkoutEntity workoutEntity = workoutRepository.save(w);

        HistoryEntity historyEntity = HistoryEntity.builder()
            .exercise(exerciseEntity)
            .reps((short) 10)
            .weight(50F)
            .unilateral(true)
            .workout(workoutEntity)
            .build();
        historyRepository.save(historyEntity);

        History historyToUpdate = historyMapper.toDto(historyEntity);
        historyToUpdate.setReps((short) 12);

        UserEntity otherUser = userRepository.findById(2L).orElseThrow(UserNotFoundException::new);

        assertThrows(ApiException.class, () -> service.update(otherUser, historyToUpdate.getId(), historyToUpdate));
        assertThrows(ApiException.class, () -> service.delete(otherUser, historyToUpdate.getId()));
    }

    @Test
    void shouldThrowExceptionFindByIdAfterDeleteHistory() {
        WorkoutEntity w = WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .gym(gymEntity)
            .date(LocalDateTime.now())
            .build();
        WorkoutEntity workoutEntity = workoutRepository.save(w);

        HistoryEntity historyEntity = HistoryEntity.builder()
            .exercise(exerciseEntity)
            .reps((short) 10)
            .weight(50F)
            .unilateral(true)
            .workout(workoutEntity)
            .build();
        historyRepository.save(historyEntity);


        History historyToUpdate = historyMapper.toDto(historyEntity);
        historyToUpdate.setReps((short) 12);
        historyToUpdate.setWeight(60F);

        service.delete(userEntity, historyToUpdate.getId());

        ApiException exception = assertThrows(ApiException.class, () -> historyRepository.findById(historyToUpdate.getId())
            .orElseThrow(() -> new ApiException(ErrorCodeEnum.HISTORY_NOT_FOUND, "Cet historique n'existe pas", HttpStatus.NOT_FOUND)));
        assertEquals("Cet historique n'existe pas", exception.getMessage());
        assertEquals(ErrorCodeEnum.HISTORY_NOT_FOUND, exception.getErrorCode());
        assertEquals(HttpStatus.NOT_FOUND, exception.getHttpStatus());
    }

    @Test
    void shouldNotDeleteWorkoutAfterDeleteOneHistory() {
        WorkoutEntity w = WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .gym(gymEntity)
            .date(LocalDateTime.now())
            .build();
        WorkoutEntity workoutEntity = workoutRepository.save(w);

        HistoryEntity historyEntity = HistoryEntity.builder()
            .exercise(exerciseEntity)
            .reps((short) 10)
            .weight(50F)
            .unilateral(true)
            .workout(workoutEntity)
            .build();
        historyRepository.save(historyEntity);

        HistoryEntity historyEntity2 = HistoryEntity.builder()
            .exercise(exerciseEntity)
            .reps((short) 10)
            .weight(50F)
            .unilateral(true)
            .workout(workoutEntity)
            .build();
        historyRepository.save(historyEntity2);


        History historyToUpdate = historyMapper.toDto(historyEntity);
        historyToUpdate.setReps((short) 12);
        historyToUpdate.setWeight(60F);

        service.delete(userEntity, historyToUpdate.getId());

        WorkoutEntity workoutExist = workoutRepository.findById(workoutEntity.getId())
            .orElseThrow(() -> new ApiException(ErrorCodeEnum.WORKOUT_NOT_FOUND, "Cette séance n'existe pas", HttpStatus.NOT_FOUND));
        assertNotNull(workoutExist);
        assertNotNull(workoutExist.getId());
    }

    @Test
    void shouldDeleteWorkoutSinceAllHistoryHaveBeenDeleted() {
        WorkoutEntity w = WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .gym(gymEntity)
            .date(LocalDateTime.now())
            .build();
        WorkoutEntity workoutEntity = workoutRepository.save(w);

        HistoryEntity historyEntity = HistoryEntity.builder()
            .exercise(exerciseEntity)
            .reps((short) 10)
            .weight(50F)
            .unilateral(true)
            .workout(workoutEntity)
            .build();
        historyRepository.save(historyEntity);


        History historyToUpdate = historyMapper.toDto(historyEntity);
        historyToUpdate.setReps((short) 12);
        historyToUpdate.setWeight(60F);

        service.delete(userEntity, historyToUpdate.getId());

        assertThrows(ApiException.class, () -> workoutRepository.findById(workoutEntity.getId())
            .orElseThrow(() -> new ApiException(ErrorCodeEnum.WORKOUT_NOT_FOUND, "Cette séance n'existe pas", HttpStatus.NOT_FOUND)));
    }
}

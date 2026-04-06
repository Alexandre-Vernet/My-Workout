package com.avernet.myworkoutapi;

import com.avernet.myworkoutapi.exception.ApiException;
import com.avernet.myworkoutapi.exception.ErrorCodeEnum;
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
import org.springframework.test.context.jdbc.Sql;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
@Sql(scripts = "/data.sql")
public class HistoryTest {

    @Resource
    HistoryService service;

    @Resource
    UserRepository userRepository;

    @Resource
    ExerciseRepository exerciseRepository;

    @Resource
    WorkoutRepository workoutRepository;

    @Resource
    HistoryRepository historyRepository;

    @Resource
    MuscleGroupRepository muscleGroupRepository;

    @Resource
    UserExerciseRepository userExerciseRepository;

    @Resource
    private HistoryMapper historyMapper;


    UserEntity userEntity;
    ExerciseEntity exerciseEntity;
    MuscleGroupEntity muscleGroupEntity;

    @BeforeEach
    void setup() {
        userEntity = userRepository.findById(1L)
            .orElseThrow(() -> new ApiException(ErrorCodeEnum.USER_NOT_FOUND, "Cet utilisateur n'existe pas", HttpStatus.NOT_FOUND));
        exerciseEntity = exerciseRepository.findById(1L)
            .orElseThrow(() -> new ApiException(ErrorCodeEnum.EXERCISE_NOT_FOUND, "Cet exercice n'existe pas", HttpStatus.NOT_FOUND));
        muscleGroupEntity = muscleGroupRepository.findById(1L)
            .orElseThrow(() -> new ApiException(ErrorCodeEnum.MUSCLE_GROUP_NOT_FOUND, "Ce groupe musculaire n'existe pas", HttpStatus.NOT_FOUND));
    }


    @Test
    void shouldFindLastHistory() {
        for (int i = 1; i < 4; i++) {
            WorkoutEntity w = WorkoutEntity.builder()
                .user(userEntity)
                .muscleGroup(muscleGroupEntity)
                .date(LocalDate.of(2026, 1, i))
                .build();
            WorkoutEntity workoutEntity = workoutRepository.save(w);

            for (int j = 1; j < 5; j++) {
                HistoryEntity historyEntity = HistoryEntity.builder()
                    .exercise(exerciseEntity)
                    .reps((short) 10)
                    .weight(50F + i + j)
                    .workout(workoutEntity)
                    .build();
                historyRepository.save(historyEntity);
            }
        }

        History history = service.findLastHistoryWeightByExerciseId(userEntity, exerciseEntity.getId());
        assertNotNull(history);
        assertEquals(54F, history.getWeight());
    }

    @Test
    void shouldFindTodayHistories() {
        WorkoutEntity w = WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .date(LocalDate.now())
            .build();
        WorkoutEntity workoutEntity = workoutRepository.save(w);

        HistoryEntity historyEntity = HistoryEntity.builder()
            .exercise(exerciseEntity)
            .reps((short) 10)
            .weight(50F)
            .workout(workoutEntity)
            .build();
        historyRepository.save(historyEntity);

        List<History> history = service.findTodayHistories(userEntity, muscleGroupEntity.getId().longValue(), exerciseEntity.getId());
        assertNotNull(history);
        assertEquals(1, history.size());
    }

    @Test
    void shouldNotFindHistoriesFromOthersDays() {
        WorkoutEntity w = WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .date(LocalDate.of(2026, 1, 1))
            .build();
        WorkoutEntity workoutEntity = workoutRepository.save(w);

        HistoryEntity historyEntity = HistoryEntity.builder()
            .exercise(exerciseEntity)
            .reps((short) 10)
            .weight(50F)
            .workout(workoutEntity)
            .build();
        historyRepository.save(historyEntity);

        List<History> history = service.findTodayHistories(userEntity, muscleGroupEntity.getId().longValue(), exerciseEntity.getId());
        assertEquals(0, history.size());
    }

    @Test
    void shouldFindStats() {
        for (int i = 1; i <= 10; i++) {
            ExerciseEntity exercise = exerciseRepository.findById((long) i)
                .orElseThrow(() -> new ApiException(ErrorCodeEnum.EXERCISE_NOT_FOUND, "Cet exercice n'existe pas", HttpStatus.NOT_FOUND));
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
                .date(LocalDate.of(2026, 1, i))
                .build();
            workoutRepository.save(workoutEntity);
        }


        UserExercisesCountTotalWorkout userExercisesCountTotalWorkout = service.getGlobalStatsWithListExercises(userEntity);
        assertNotNull(userExercisesCountTotalWorkout);
        assertEquals(10, userExercisesCountTotalWorkout.exercises().size());
        assertEquals(5, userExercisesCountTotalWorkout.countTotalDaysWorkout());
    }

    @Test
    void shouldFindDataForGraph() {
        for (int i = 1; i <= 3; i++) {
            WorkoutEntity w = WorkoutEntity.builder()
                .user(userEntity)
                .muscleGroup(muscleGroupEntity)
                .date(LocalDate.of(20226, 1, i))
                .build();
            WorkoutEntity workoutEntity = workoutRepository.save(w);

            for (int j = 1; j <= 5; j++) {
                HistoryEntity historyEntity = HistoryEntity.builder()
                    .exercise(exerciseEntity)
                    .reps((short) 10)
                    .weight(50F + j)
                    .workout(workoutEntity)
                    .build();
                historyRepository.save(historyEntity);
            }
        }

        ExerciseGraphs exerciseGraphs = service.getExerciseGraphs(userEntity, exerciseEntity.getId());
        assertNotNull(exerciseGraphs);
        assertEquals(55F, exerciseGraphs.maxWeight());
        assertEquals(795, exerciseGraphs.totalWeight());
        assertEquals(150, exerciseGraphs.totalReps());
    }

    @Test
    void shouldUpdateHistory() {
        WorkoutEntity w = WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .date(LocalDate.now())
            .build();
        WorkoutEntity workoutEntity = workoutRepository.save(w);

        HistoryEntity historyEntity = HistoryEntity.builder()
            .exercise(exerciseEntity)
            .reps((short) 10)
            .weight(50F)
            .workout(workoutEntity)
            .build();
        historyRepository.save(historyEntity);


        History historyToUpdate = historyMapper.toDto(historyEntity);
        historyToUpdate.setReps((short) 12);
        historyToUpdate.setWeight(60F);

        History updatedHistory = service.update(historyToUpdate.getId(), historyToUpdate);
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
            .date(LocalDate.now())
            .build();
        WorkoutEntity workoutEntity = workoutRepository.save(w);

        HistoryEntity historyEntity = HistoryEntity.builder()
            .exercise(exerciseEntity)
            .reps((short) 10)
            .weight(50F)
            .workout(workoutEntity)
            .build();
        historyRepository.save(historyEntity);


        History historyToUpdate = historyMapper.toDto(historyEntity);
        historyToUpdate.setId(2L);
        historyToUpdate.setReps((short) 12);
        historyToUpdate.setWeight(60F);

        ApiException exception = assertThrows(ApiException.class, () -> service.update(historyToUpdate.getId(), historyToUpdate));
        assertEquals("Cet historique n'existe pas", exception.getMessage());
        assertEquals(ErrorCodeEnum.HISTORY_NOT_FOUND, exception.getErrorCode());
        assertEquals(HttpStatus.NOT_FOUND, exception.getHttpStatus());
    }

    @Test
    void shouldThrowExceptionFindByIdAfterDeleteHistory() {
        WorkoutEntity w = WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .date(LocalDate.now())
            .build();
        WorkoutEntity workoutEntity = workoutRepository.save(w);

        HistoryEntity historyEntity = HistoryEntity.builder()
            .exercise(exerciseEntity)
            .reps((short) 10)
            .weight(50F)
            .workout(workoutEntity)
            .build();
        historyRepository.save(historyEntity);


        History historyToUpdate = historyMapper.toDto(historyEntity);
        historyToUpdate.setReps((short) 12);
        historyToUpdate.setWeight(60F);

        service.delete(historyToUpdate.getId());

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
            .date(LocalDate.now())
            .build();
        WorkoutEntity workoutEntity = workoutRepository.save(w);

        HistoryEntity historyEntity = HistoryEntity.builder()
            .exercise(exerciseEntity)
            .reps((short) 10)
            .weight(50F)
            .workout(workoutEntity)
            .build();
        historyRepository.save(historyEntity);

        HistoryEntity historyEntity2 = HistoryEntity.builder()
            .exercise(exerciseEntity)
            .reps((short) 10)
            .weight(50F)
            .workout(workoutEntity)
            .build();
        historyRepository.save(historyEntity2);


        History historyToUpdate = historyMapper.toDto(historyEntity);
        historyToUpdate.setReps((short) 12);
        historyToUpdate.setWeight(60F);

        service.delete(historyToUpdate.getId());

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
            .date(LocalDate.now())
            .build();
        WorkoutEntity workoutEntity = workoutRepository.save(w);

        HistoryEntity historyEntity = HistoryEntity.builder()
            .exercise(exerciseEntity)
            .reps((short) 10)
            .weight(50F)
            .workout(workoutEntity)
            .build();
        historyRepository.save(historyEntity);


        History historyToUpdate = historyMapper.toDto(historyEntity);
        historyToUpdate.setReps((short) 12);
        historyToUpdate.setWeight(60F);

        service.delete(historyToUpdate.getId());

        assertThrows(ApiException.class, () -> workoutRepository.findById(workoutEntity.getId())
            .orElseThrow(() -> new ApiException(ErrorCodeEnum.WORKOUT_NOT_FOUND, "Cette séance n'existe pas", HttpStatus.NOT_FOUND)));
    }
}

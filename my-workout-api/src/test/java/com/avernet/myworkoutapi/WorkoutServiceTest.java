package com.avernet.myworkoutapi;

import com.avernet.myworkoutapi.exercise.ExerciseEntity;
import com.avernet.myworkoutapi.exercise.ExerciseRepository;
import com.avernet.myworkoutapi.history.History;
import com.avernet.myworkoutapi.history.HistoryEntity;
import com.avernet.myworkoutapi.history.HistoryMapper;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupEntity;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupRepository;
import com.avernet.myworkoutapi.user.UserEntity;
import com.avernet.myworkoutapi.user.UserRepository;
import com.avernet.myworkoutapi.workout.Workout;
import com.avernet.myworkoutapi.workout.WorkoutEntity;
import com.avernet.myworkoutapi.workout.WorkoutGroupedHistories;
import com.avernet.myworkoutapi.workout.WorkoutMapper;
import com.avernet.myworkoutapi.workout.WorkoutRepository;
import com.avernet.myworkoutapi.workout.WorkoutRequest;
import com.avernet.myworkoutapi.workout.WorkoutService;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.jdbc.Sql;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
@Sql(scripts = "/data.sql")
public class WorkoutServiceTest {

    @Resource
    WorkoutService service;

    @Resource
    WorkoutRepository workoutRepository;

    @Resource
    ExerciseRepository exerciseRepository;

    @Resource
    MuscleGroupRepository muscleGroupRepository;

    @Resource
    UserRepository userRepository;

    @Resource
    WorkoutMapper workoutMapper;

    @Resource
    HistoryMapper historyMapper;



    UserEntity userEntity;
    MuscleGroupEntity muscleGroupEntity;

    @BeforeEach
    void setup() {
        userEntity = userRepository.findById(1L).orElse(null);
        muscleGroupEntity = muscleGroupRepository.findById(1L).orElse(null);
    }


    @Test
    void shouldCreateWorkout() {
        WorkoutEntity workoutEntity = WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .date(LocalDate.now())
            .histories(List.of())
            .build();

        ExerciseEntity exerciseEntity = exerciseRepository.findById(1L).orElse(null);

        HistoryEntity historyEntity = HistoryEntity.builder()
            .exercise(exerciseEntity)
            .weight(50F)
            .reps((short) 10)
            .workout(workoutEntity)
            .build();


        Workout workout = workoutMapper.toDto(workoutEntity);
        History history = historyMapper.toDto(historyEntity);


        WorkoutRequest workoutRequest = new WorkoutRequest(workout, history);

        Workout workoutCreated = service.createWorkout(userEntity, workoutRequest);
        WorkoutEntity workoutEntityCreated = workoutRepository.findById(workoutCreated.getId()).orElse(null);
        assertNotNull(workoutCreated);
        assertNotNull(workoutEntityCreated);
        assertEquals(workoutEntityCreated.getId(), workoutCreated.getId());
    }

    @Test
    void shouldFindExistingWorkoutIfAlreadyExist() {
        WorkoutEntity workoutEntity = WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .date(LocalDate.now())
            .histories(List.of())
            .build();
        workoutRepository.save(workoutEntity);

        Optional<WorkoutEntity> existingWorkout = workoutRepository.findByUserIdAndMuscleGroupIdAndDate(userEntity.getId(),
            workoutEntity.getMuscleGroup().getId(),
            workoutEntity.getDate());
        assertTrue(existingWorkout.isPresent());
        assertNotNull(existingWorkout.get());
    }

    @Test
    void shouldNotFindExistingWorkoutIfAlreadyExist() {
        WorkoutEntity workoutEntity = WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .date(LocalDate.now())
            .histories(List.of())
            .build();

        Optional<WorkoutEntity> existingWorkout = workoutRepository.findByUserIdAndMuscleGroupIdAndDate(userEntity.getId(),
            workoutEntity.getMuscleGroup().getId(),
            workoutEntity.getDate());
        assertFalse(existingWorkout.isPresent());
    }

    @Test
    void shouldFindWorkoutByDate() {
        WorkoutEntity workoutEntity = WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .date(LocalDate.now())
            .build();
        workoutRepository.save(workoutEntity);

        String start = LocalDate.now().toString();
        String end = LocalDate.now().plusMonths(1).toString();
        List<Workout> workoutList = service.findByDate(userEntity, start, end);
        assertNotNull(workoutList);
        assertEquals(1, workoutList.size());
    }

    @Test
    void shouldNotFindOthersWorkoutUserByDate() {
        UserEntity otherUser = userRepository.findById(2L).orElse(null);

        WorkoutEntity workoutEntity = WorkoutEntity.builder()
            .user(otherUser)
            .muscleGroup(muscleGroupEntity)
            .date(LocalDate.now())
            .build();
        workoutRepository.save(workoutEntity);

        String start = LocalDate.now().toString();
        String end = LocalDate.now().plusMonths(1).toString();
        List<Workout> workoutList = service.findByDate(userEntity, start, end);
        assertEquals(0, workoutList.size());
    }

    @Test
    void shouldFindWorkout() {
        ExerciseEntity exerciseEntity1 = exerciseRepository.findById(1L).orElse(null);
        ExerciseEntity exerciseEntity2 = exerciseRepository.findById(2L).orElse(null);
        ExerciseEntity exerciseEntity3 = exerciseRepository.findById(3L).orElse(null);


        WorkoutEntity workoutEntity = WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .date(LocalDate.now())
            .build();

        HistoryEntity historyEntity1Exercise1 = HistoryEntity.builder().workout(workoutEntity).reps((short) 10).exercise(exerciseEntity1).build();
        HistoryEntity historyEntity2Exercise1 = HistoryEntity.builder().workout(workoutEntity).reps((short) 10).exercise(exerciseEntity1).build();
        HistoryEntity historyEntity3Exercise1 = HistoryEntity.builder().workout(workoutEntity).reps((short) 10).exercise(exerciseEntity1).build();

        HistoryEntity historyEntity1Exercise2 = HistoryEntity.builder().workout(workoutEntity).reps((short) 10).exercise(exerciseEntity2).build();
        HistoryEntity historyEntity2Exercise2 = HistoryEntity.builder().workout(workoutEntity).reps((short) 10).exercise(exerciseEntity2).build();
        HistoryEntity historyEntity3Exercise2 = HistoryEntity.builder().workout(workoutEntity).reps((short) 10).exercise(exerciseEntity2).build();


        HistoryEntity historyEntity1Exercise3 = HistoryEntity.builder().workout(workoutEntity).reps((short) 10).exercise(exerciseEntity3).build();
        HistoryEntity historyEntity2Exercise3 = HistoryEntity.builder().workout(workoutEntity).reps((short) 10).exercise(exerciseEntity3).build();
        HistoryEntity historyEntity3Exercise3 = HistoryEntity.builder().workout(workoutEntity).reps((short) 10).exercise(exerciseEntity3).build();


        List<HistoryEntity> historyEntityList = List.of(
            historyEntity1Exercise1, historyEntity2Exercise1, historyEntity3Exercise1,
            historyEntity1Exercise2, historyEntity2Exercise2, historyEntity3Exercise2,
            historyEntity1Exercise3, historyEntity2Exercise3, historyEntity3Exercise3
            );
        workoutEntity.setHistories(historyEntityList);

        workoutRepository.save(workoutEntity);

        WorkoutGroupedHistories workoutGroupedHistories = service.find(userEntity, workoutEntity.getId());
        assertNotNull(workoutGroupedHistories);
        assertEquals(muscleGroupEntity.getName(), workoutGroupedHistories.getMuscleGroup().name());
        assertEquals(workoutGroupedHistories.getHistoryGroups().size(), 3);
    }

    @Test
    void shouldDeleteWorkout() {
        Long workoutId = 1L;

        WorkoutEntity workoutEntity = WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .date(LocalDate.now())
            .build();
        workoutRepository.save(workoutEntity);

        service.delete(userEntity, workoutId);

        Optional<WorkoutEntity> workoutDeleted = workoutRepository.findById(1L);
        assertFalse(workoutDeleted.isPresent());
    }
}

package com.avernet.myworkoutapi;

import com.avernet.myworkoutapi.error.ErrorCodeEnum;
import com.avernet.myworkoutapi.exception.ApiException;
import com.avernet.myworkoutapi.exercise.Exercise;
import com.avernet.myworkoutapi.exercise.ExerciseDifficultyEnum;
import com.avernet.myworkoutapi.exercise.ExerciseEntity;
import com.avernet.myworkoutapi.exercise.ExerciseMapper;
import com.avernet.myworkoutapi.exercise.ExerciseMechanicEnum;
import com.avernet.myworkoutapi.exercise.ExerciseNotFoundException;
import com.avernet.myworkoutapi.exercise.ExerciseRepository;
import com.avernet.myworkoutapi.exercise.ExerciseService;
import com.avernet.myworkoutapi.exercisemuscle.ExerciseMuscle;
import com.avernet.myworkoutapi.exercisemuscle.ExerciseMuscleAddedToWorkout;
import com.avernet.myworkoutapi.muscle.Muscle;
import com.avernet.myworkoutapi.muscle.MuscleEntity;
import com.avernet.myworkoutapi.muscle.MuscleMapper;
import com.avernet.myworkoutapi.muscle.MuscleRepository;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupEntity;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupEnum;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupNotFoundException;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupRepository;
import com.avernet.myworkoutapi.user.UserEntity;
import com.avernet.myworkoutapi.user.UserNotFoundException;
import com.avernet.myworkoutapi.user.UserRepository;
import com.avernet.myworkoutapi.userexercise.UserExerciseEntity;
import com.avernet.myworkoutapi.userexercise.UserExerciseRepository;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
@Sql(scripts = "/data.sql")
public class ExerciseServiceTest {

    @Resource
    private ExerciseService service;

    @Resource
    private UserRepository userRepository;

    @Resource
    private UserExerciseRepository userExerciseRepository;

    @Resource
    private ExerciseRepository exerciseRepository;

    @Resource
    private MuscleRepository muscleRepository;

    @Resource
    private MuscleGroupRepository muscleGroupRepository;

    @Resource
    private MuscleMapper muscleMapper;

    @Resource
    private ExerciseMapper exerciseMapper;

    UserEntity userEntity;
    ExerciseEntity exerciseEntity;
    ExerciseEntity exerciseEntity2;
    ExerciseEntity exerciseEntity3;


    @BeforeEach
    void setup() {
        userEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);
        exerciseEntity = exerciseRepository.findById(1L).orElseThrow(ExerciseNotFoundException::new);
        exerciseEntity2 = exerciseRepository.findById(2L).orElseThrow(ExerciseNotFoundException::new);
        exerciseEntity3 = exerciseRepository.findById(3L).orElseThrow(ExerciseNotFoundException::new);
    }

    @Test
    void findAll_shouldFindAllExercices() {
        List<Exercise> exerciseList = service.findAll();

        assertNotNull(exerciseList);
        exerciseList.forEach(exercise -> {
            assertNotNull(exercise.getId());
            assertNotNull(exercise.getDescription());
            assertNotNull(exercise.getMuscles());
            assertNotNull(exercise.getMuscles().getFirst().muscleGroup().name());

        });
    }

    @Test
    void findExercisesByMuscleGroup_shouldReturnExercices() {
        List<Exercise> exerciseList = service.findExercisesByMuscleGroup(1L);

        assertNotNull(exerciseList);
        exerciseList.forEach(exercise -> {
            assertNotNull(exercise.getId());
            assertNotNull(exercise.getDescription());
            assertNotNull(exercise.getMuscles());
            assertEquals(MuscleGroupEnum.PECTORAUX, exercise.getMuscles().getFirst().muscleGroup().name());
        });
    }

    @Test
    void search_shouldFindExercice() {
        String search = "Développé incliné halt";
        List<Exercise> exerciseList = service.search(search);

        assertNotNull(exerciseList);
        assertEquals(1, exerciseList.size());
        assertEquals("Développé incliné haltères", exerciseList.getFirst().getName());
    }

    @Test
    void findCardioExercises_shouldReturnCardioExercises() {
        UserEntity userEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);
        ExerciseEntity exerciseEntity = exerciseRepository.findById(28L).orElseThrow(ExerciseNotFoundException::new);

        UserExerciseEntity userExerciseEntity = UserExerciseEntity.builder()
            .user(userEntity)
            .exercise(exerciseEntity)
            .build();

        userExerciseRepository.save(userExerciseEntity);

        List<Exercise> exerciseList = service.findCardioExercises(userEntity);
        assertNotNull(exerciseList);
        assertEquals(1, exerciseList.size());
        assertFalse(exerciseList.isEmpty());
    }

    @Test
    void findExercisesMuscle_shouldFindExercisesMuscle() {
        ExerciseEntity exerciseEntity = exerciseRepository.findById(1L).orElseThrow(ExerciseNotFoundException::new);

        ExerciseMuscleAddedToWorkout exerciseMuscle = service.findExercisesMuscle(exerciseEntity.getId());
        assertNotNull(exerciseMuscle);
        assertNotNull(exerciseMuscle.exercise());
        assertFalse(exerciseMuscle.muscles().isEmpty());
    }

    @Test
    @Transactional
    void createOrUpdateExercise_shouldCreateExercise() {
        Exercise exercise = Exercise.builder()
            .name("My custom exercise")
            .description("My custom desc")
            .difficulty(ExerciseDifficultyEnum.INTERMEDIATE)
            .mechanic(ExerciseMechanicEnum.ISOLATION)
            .build();

        List<Muscle> muscleList = new ArrayList<>();
        MuscleEntity muscleEntity1 = muscleRepository.findById(3L)
            .orElseThrow(() -> new ApiException(ErrorCodeEnum.MUSCLE_NOT_FOUND, "Muscle introuvable", HttpStatus.NOT_FOUND));
        MuscleEntity muscleEntity2 = muscleRepository.findById(4L)
            .orElseThrow(() -> new ApiException(ErrorCodeEnum.MUSCLE_NOT_FOUND, "Muscle introuvable", HttpStatus.NOT_FOUND));
        MuscleEntity muscleEntity3 = muscleRepository.findById(5L)
            .orElseThrow(() -> new ApiException(ErrorCodeEnum.MUSCLE_NOT_FOUND, "Muscle introuvable", HttpStatus.NOT_FOUND));
        muscleList.add(muscleMapper.toDto(muscleEntity1));
        muscleList.add(muscleMapper.toDto(muscleEntity2));
        muscleList.add(muscleMapper.toDto(muscleEntity3));

        ExerciseMuscle exerciseMuscle = new ExerciseMuscle(exercise, muscleList);

        Exercise exerciseCreated = service.createOrUpdateExercise(exerciseMuscle);
        ExerciseEntity exerciseEntity = exerciseRepository.findById(exerciseCreated.getId()).orElseThrow(ExerciseNotFoundException::new);
        assertNotNull(exerciseCreated);
        assertNotNull(exerciseEntity);
        assertEquals("My custom exercise", exerciseEntity.getName());
        assertEquals(ExerciseDifficultyEnum.INTERMEDIATE, exerciseEntity.getDifficulty());
        assertEquals(ExerciseMechanicEnum.ISOLATION, exerciseEntity.getMechanic());
    }

    @Test
    @Transactional
    void createOrUpdateExercise_shouldUpdateExercise() {
        Exercise exercise = Exercise.builder()
            .id(1L)
            .name("Updated exercise name")
            .description("Updated exercise desc")
            .difficulty(ExerciseDifficultyEnum.INTERMEDIATE)
            .mechanic(ExerciseMechanicEnum.ISOLATION)
            .build();

        List<Muscle> muscleList = new ArrayList<>();
        MuscleEntity muscleEntity1 = muscleRepository.findById(3L)
            .orElseThrow(() -> new ApiException(ErrorCodeEnum.MUSCLE_NOT_FOUND, "Muscle introuvable", HttpStatus.NOT_FOUND));
        MuscleEntity muscleEntity2 = muscleRepository.findById(4L)
            .orElseThrow(() -> new ApiException(ErrorCodeEnum.MUSCLE_NOT_FOUND, "Muscle introuvable", HttpStatus.NOT_FOUND));
        MuscleEntity muscleEntity3 = muscleRepository.findById(5L)
            .orElseThrow(() -> new ApiException(ErrorCodeEnum.MUSCLE_NOT_FOUND, "Muscle introuvable", HttpStatus.NOT_FOUND));
        muscleList.add(muscleMapper.toDto(muscleEntity1));
        muscleList.add(muscleMapper.toDto(muscleEntity2));
        muscleList.add(muscleMapper.toDto(muscleEntity3));

        ExerciseMuscle exerciseMuscle = new ExerciseMuscle(exercise, muscleList);

        Exercise exerciseUpdated = service.createOrUpdateExercise(exerciseMuscle);
        ExerciseEntity exerciseEntity = exerciseRepository.findById(exerciseUpdated.getId()).orElseThrow(ExerciseNotFoundException::new);
        assertNotNull(exerciseUpdated);
        assertNotNull(exerciseEntity);
        assertEquals(exercise.getId(), exerciseEntity.getId());
        assertEquals("Updated exercise name", exerciseEntity.getName());
        assertEquals("Updated exercise desc", exerciseEntity.getDescription());
        assertEquals(ExerciseDifficultyEnum.INTERMEDIATE, exerciseEntity.getDifficulty());
        assertEquals(ExerciseMechanicEnum.ISOLATION, exerciseEntity.getMechanic());
    }

    @Test
    @Transactional
    void createOrUpdateExercise_shouldThrowExceptionCreateExerciseWithMultipleDifferentsMuscleGroup() {
        Exercise exercise = Exercise.builder()
            .id(1L)
            .name("Updated exercise name")
            .description("Updated exercise desc")
            .difficulty(ExerciseDifficultyEnum.INTERMEDIATE)
            .mechanic(ExerciseMechanicEnum.ISOLATION)
            .build();

        List<Muscle> muscleList = new ArrayList<>();
        MuscleEntity muscleEntity1 = muscleRepository.findById(25L)
            .orElseThrow(() -> new ApiException(ErrorCodeEnum.MUSCLE_NOT_FOUND, "Muscle introuvable", HttpStatus.NOT_FOUND));
        MuscleEntity muscleEntity2 = muscleRepository.findById(33L)
            .orElseThrow(() -> new ApiException(ErrorCodeEnum.MUSCLE_NOT_FOUND, "Muscle introuvable", HttpStatus.NOT_FOUND));
        MuscleEntity muscleEntity3 = muscleRepository.findById(16L)
            .orElseThrow(() -> new ApiException(ErrorCodeEnum.MUSCLE_NOT_FOUND, "Muscle introuvable", HttpStatus.NOT_FOUND));
        muscleList.add(muscleMapper.toDto(muscleEntity1));
        muscleList.add(muscleMapper.toDto(muscleEntity2));
        muscleList.add(muscleMapper.toDto(muscleEntity3));

        ExerciseMuscle exerciseMuscle = new ExerciseMuscle(exercise, muscleList);

        ApiException apiException = assertThrows(ApiException.class, () -> service.createOrUpdateExercise(exerciseMuscle));
        assertNotNull(apiException);
        assertEquals(ErrorCodeEnum.DOUBLE_MUSCLE_GROUP, apiException.getErrorCode());
        assertEquals("Impossible de sélectionner 2 groupes musculaires", apiException.getMessage());
        assertEquals(HttpStatus.BAD_REQUEST, apiException.getHttpStatus());
    }

    @Test
    @Transactional
    void createOrUpdateExercise_shouldThrowException() {
        ExerciseEntity exerciseEntity = exerciseRepository.findById(1L).orElseThrow(ExerciseNotFoundException::new);
        Exercise exercise = exerciseMapper.toDto(exerciseEntity);
        exercise.setId(null);
        ExerciseMuscle exerciseMuscle = new ExerciseMuscle(exercise, null);

        ApiException apiException = assertThrows(ApiException.class, () -> service.createOrUpdateExercise(exerciseMuscle));
        assertEquals(ErrorCodeEnum.EXERCISE_NAME_ALREADY_EXIST, apiException.getErrorCode());
        assertEquals("Cet exercice existe déjà", apiException.getMessage());
        assertEquals(HttpStatus.CONFLICT, apiException.getHttpStatus());
    }

    @Test
    void findAddedExercisesByMuscleGroupId_shouldFindExercisesExceptExercisesNotLinkedToMuscleGroupSelected() {
        MuscleGroupEntity muscleGroupEntity = muscleGroupRepository.findById(1L).orElseThrow(MuscleGroupNotFoundException::new);

        ExerciseEntity exerciseEntity4 = exerciseRepository.findById(20L).orElseThrow(ExerciseNotFoundException::new); /*Exercise is not linked to the muscle group 1*/

        UserExerciseEntity userExerciseEntity1 = UserExerciseEntity.builder().order(1).user(userEntity).exercise(exerciseEntity).build();
        UserExerciseEntity userExerciseEntity2 = UserExerciseEntity.builder().order(2).user(userEntity).exercise(exerciseEntity2).build();
        UserExerciseEntity userExerciseEntity3 = UserExerciseEntity.builder().order(3).user(userEntity).exercise(exerciseEntity3).build();
        UserExerciseEntity userExerciseEntity4 = UserExerciseEntity.builder().order(4).user(userEntity).exercise(exerciseEntity4).build();
        userExerciseRepository.save(userExerciseEntity1);
        userExerciseRepository.save(userExerciseEntity2);
        userExerciseRepository.save(userExerciseEntity3);
        userExerciseRepository.save(userExerciseEntity4);

        List<Exercise> exerciseList = service.findAddedExercisesByMuscleGroupId(userEntity, muscleGroupEntity.getId());
        assertFalse(exerciseList.isEmpty());
        assertEquals(3, exerciseList.size());
    }

    @Test
    @Transactional
    void toggleExercise_shouldCreateUserExercise() {
        Exercise userExercise1 = service.toggleExercise(userEntity, exerciseMapper.toDto(exerciseEntity));
        assertNotNull(userExercise1);
        assertEquals(1, userExercise1.getOrder());
        Boolean userExerciseEntity = userExerciseRepository.existsByExerciseAndUser(exerciseEntity, userEntity);
        assertTrue(userExerciseEntity);

        Exercise userExercise2 = service.toggleExercise(userEntity, exerciseMapper.toDto(exerciseEntity2));
        assertNotNull(userExercise2);
        assertEquals(2, userExercise2.getOrder());
        Boolean userExerciseEntity2 = userExerciseRepository.existsByExerciseAndUser(exerciseEntity, userEntity);
        assertTrue(userExerciseEntity2);

        Exercise userExercise3 = service.toggleExercise(userEntity, exerciseMapper.toDto(exerciseEntity3));
        assertNotNull(userExercise3);
        assertEquals(3, userExercise3.getOrder());
        Boolean userExerciseEntity3 = userExerciseRepository.existsByExerciseAndUser(exerciseEntity, userEntity);
        assertTrue(userExerciseEntity3);
    }

    @Test
    @Transactional
    void toggleExercise_shouldDeleteUserExercise() {
        ExerciseEntity exerciseEntity = exerciseRepository.findById(1L).orElseThrow(ExerciseNotFoundException::new);

        UserExerciseEntity userExercise = UserExerciseEntity.builder()
            .user(userEntity)
            .exercise(exerciseEntity)
            .build();

        userExerciseRepository.save(userExercise);

        service.toggleExercise(userEntity, exerciseMapper.toDto(exerciseEntity));
        Boolean userExerciseEntity = userExerciseRepository.existsByExerciseAndUser(exerciseEntity, userEntity);
        assertFalse(userExerciseEntity);
    }
}

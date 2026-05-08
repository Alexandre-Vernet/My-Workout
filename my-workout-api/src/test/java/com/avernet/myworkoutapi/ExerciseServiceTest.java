package com.avernet.myworkoutapi;

import com.avernet.myworkoutapi.error.ErrorCodeEnum;
import com.avernet.myworkoutapi.exception.ApiException;
import com.avernet.myworkoutapi.exercise.Exercise;
import com.avernet.myworkoutapi.exercise.ExerciseAddedToWorkout;
import com.avernet.myworkoutapi.exercise.ExerciseEntity;
import com.avernet.myworkoutapi.exercise.ExerciseMapper;
import com.avernet.myworkoutapi.exercise.ExerciseNotFoundException;
import com.avernet.myworkoutapi.exercise.ExerciseRepository;
import com.avernet.myworkoutapi.exercise.ExerciseService;
import com.avernet.myworkoutapi.exercise.MuscleGroupExercises;
import com.avernet.myworkoutapi.exercisemuscle.ExerciseMuscle;
import com.avernet.myworkoutapi.exercisemuscle.ExerciseMuscleAddedToWorkout;
import com.avernet.myworkoutapi.muscle.Muscle;
import com.avernet.myworkoutapi.muscle.MuscleEntity;
import com.avernet.myworkoutapi.muscle.MuscleMapper;
import com.avernet.myworkoutapi.muscle.MuscleRepository;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupType;
import com.avernet.myworkoutapi.user.UserEntity;
import com.avernet.myworkoutapi.user.UserNotFoundException;
import com.avernet.myworkoutapi.user.UserRepository;
import com.avernet.myworkoutapi.userexercise.UserExerciseEntity;
import com.avernet.myworkoutapi.userexercise.UserExerciseRepository;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
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
    ExerciseService service;

    @Resource
    UserRepository userRepository;

    @Resource
    UserExerciseRepository userExerciseRepository;

    @Resource
    ExerciseRepository exerciseRepository;

    @Resource
    MuscleRepository muscleRepository;

    @Resource
    MuscleMapper muscleMapper;
    @Autowired
    private ExerciseMapper exerciseMapper;


    @Test
    void findAllExercisesByUserAndMuscleGroupId_shouldFindExercises() {
        UserEntity userEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);
        ExerciseEntity exerciseEntity = exerciseRepository.findById(1L).orElseThrow(ExerciseNotFoundException::new);
        ExerciseEntity exerciseEntity2 = exerciseRepository.findById(2L).orElseThrow(ExerciseNotFoundException::new);
        ExerciseEntity exerciseEntity3 = exerciseRepository.findById(3L).orElseThrow(ExerciseNotFoundException::new);

        UserExerciseEntity userExerciseEntity = UserExerciseEntity.builder()
            .user(userEntity)
            .exercise(exerciseEntity)
            .build();

        UserExerciseEntity userExerciseEntity2 = UserExerciseEntity.builder()
            .user(userEntity)
            .exercise(exerciseEntity2)
            .build();

        UserExerciseEntity userExerciseEntity3 = UserExerciseEntity.builder()
            .user(userEntity)
            .exercise(exerciseEntity3)
            .build();

        userExerciseRepository.saveAll(List.of(userExerciseEntity, userExerciseEntity2, userExerciseEntity3));


        MuscleGroupExercises muscleGroupExercises = service.findAllExercisesByUserAndMuscleGroupId(userEntity, 1L);


        assertNotNull(muscleGroupExercises);
        assertEquals(MuscleGroupType.PECTORAUX, muscleGroupExercises.muscleGroup().name());
        assertNotNull(muscleGroupExercises.muscles());
        assertEquals(3, muscleGroupExercises.muscles().size());
        assertEquals(3, muscleGroupExercises.exerciseAddedToWorkouts().stream()
            .filter(ExerciseAddedToWorkout::addedToWorkout)
            .toList()
            .size()
        );
    }

    @Test
    void findAllExercisesByMuscleGroupId_shouldReturnAllExercices() {
        MuscleGroupExercises muscleGroupExercises = service.findAllExercisesByMuscleGroupId(1L);


        assertNotNull(muscleGroupExercises);
        assertEquals(MuscleGroupType.PECTORAUX, muscleGroupExercises.muscleGroup().name());
        assertNotNull(muscleGroupExercises.muscles());
        assertEquals(3, muscleGroupExercises.muscles().size());
        muscleGroupExercises.exerciseAddedToWorkouts()
            .forEach(exerciseAddedToWorkout -> assertFalse(exerciseAddedToWorkout.addedToWorkout()));
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
            .smartWorkout(false)
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
        assertEquals("My custom desc", exerciseEntity.getDescription());
        assertFalse(exerciseEntity.getSmartWorkout());
    }

    @Test
    @Transactional
    void createOrUpdateExercise_shouldUpdateExercise() {
        Exercise exercise = Exercise.builder()
            .id(1L)
            .name("Updated exercise name")
            .description("Updated exercise desc")
            .smartWorkout(true)
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
        assertEquals(exercise.getId(), exerciseEntity.getId());
        assertEquals("Updated exercise name", exerciseEntity.getName());
        assertEquals("Updated exercise desc", exerciseEntity.getDescription());
        assertTrue(exerciseEntity.getSmartWorkout());
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
}

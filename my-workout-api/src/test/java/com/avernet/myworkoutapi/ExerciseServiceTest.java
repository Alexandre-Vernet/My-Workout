package com.avernet.myworkoutapi;

import com.avernet.myworkoutapi.exception.ApiException;
import com.avernet.myworkoutapi.exception.ErrorCodeEnum;
import com.avernet.myworkoutapi.exercise.Exercise;
import com.avernet.myworkoutapi.exercise.ExerciseEntity;
import com.avernet.myworkoutapi.exercise.ExerciseRepository;
import com.avernet.myworkoutapi.exercise.ExerciseService;
import com.avernet.myworkoutapi.exercisemuscle.ExerciseMuscle;
import com.avernet.myworkoutapi.muscle.Muscle;
import com.avernet.myworkoutapi.muscle.MuscleEntity;
import com.avernet.myworkoutapi.muscle.MuscleMapper;
import com.avernet.myworkoutapi.muscle.MuscleRepository;
import com.avernet.myworkoutapi.user.UserEntity;
import com.avernet.myworkoutapi.user.UserRepository;
import com.avernet.myworkoutapi.userexercise.UserExerciseEntity;
import com.avernet.myworkoutapi.userexercise.UserExerciseRepository;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
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


    @Test
    void shouldReturnCardioExercises() {
        UserEntity userEntity = userRepository.findById(1L)
            .orElseThrow(() -> new ApiException(ErrorCodeEnum.USER_NOT_FOUND, "Utilisateur introuvable", HttpStatus.NOT_FOUND));
        ExerciseEntity exerciseEntity = exerciseRepository.findById(28L)
            .orElseThrow(() -> new ApiException(ErrorCodeEnum.EXERCISE_NOT_FOUND, "Exercice introuvable", HttpStatus.NOT_FOUND));

        UserExerciseEntity userExerciseEntity = UserExerciseEntity.builder()
            .user(userEntity)
            .exercise(exerciseEntity)
            .build();

        userExerciseRepository.save(userExerciseEntity);

        List<Exercise> exerciseList = service.findCardioExercises(userEntity);
        assertNotNull(exerciseList);
        assertFalse(exerciseList.isEmpty());
    }

    @Test
    void shouldFindExerciseMuscle() {
        ExerciseEntity exerciseEntity = exerciseRepository.findById(1L)
            .orElseThrow(() -> new ApiException(ErrorCodeEnum.EXERCISE_NOT_FOUND, "Exercice introuvable", HttpStatus.NOT_FOUND));

        ExerciseMuscle exerciseMuscle = service.findExerciseMuscle(exerciseEntity.getId());
        assertNotNull(exerciseMuscle);
        assertNotNull(exerciseMuscle.exercise());
        assertFalse(exerciseMuscle.muscles().isEmpty());
    }

    @Test
    @Transactional
    void shouldCreateExercise() {
        Exercise exercise = Exercise.builder()
            .name("My custom exercise")
            .description("My custom desc")
            .isSmartWorkout(false)
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
        ExerciseEntity exerciseEntity = exerciseRepository.findById(exerciseCreated.getId())
            .orElseThrow(() -> new ApiException(ErrorCodeEnum.EXERCISE_NOT_FOUND, "Exercice introuvable", HttpStatus.NOT_FOUND));
        assertNotNull(exerciseCreated);
        assertNotNull(exerciseEntity);
        assertEquals("My custom exercise", exerciseEntity.getName());
        assertEquals("My custom desc", exerciseEntity.getDescription());
        assertFalse(exerciseEntity.isSmartWorkout());
    }

    @Test
    @Transactional
    void shouldUpdateExercise() {
        Exercise exercise = Exercise.builder()
            .id(1L)
            .name("Updated exercise name")
            .description("Updated exercise desc")
            .isSmartWorkout(true)
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
        ExerciseEntity exerciseEntity = exerciseRepository.findById(exerciseCreated.getId()).orElse(null);
        assertNotNull(exerciseCreated);
        assertNotNull(exerciseEntity);
        assertEquals(exercise.getId(), exerciseEntity.getId());
        assertEquals("Updated exercise name", exerciseEntity.getName());
        assertEquals("Updated exercise desc", exerciseEntity.getDescription());
        assertTrue(exerciseEntity.isSmartWorkout());
    }
}

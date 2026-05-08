package com.avernet.myworkoutapi;

import com.avernet.myworkoutapi.exercise.ExerciseEntity;
import com.avernet.myworkoutapi.exercise.ExerciseMapper;
import com.avernet.myworkoutapi.exercise.ExerciseNotFoundException;
import com.avernet.myworkoutapi.exercise.ExerciseRepository;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupEntity;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupNotFoundException;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupRepository;
import com.avernet.myworkoutapi.user.UserEntity;
import com.avernet.myworkoutapi.user.UserMapper;
import com.avernet.myworkoutapi.user.UserNotFoundException;
import com.avernet.myworkoutapi.user.UserRepository;
import com.avernet.myworkoutapi.userexercise.UserExercise;
import com.avernet.myworkoutapi.userexercise.UserExerciseEntity;
import com.avernet.myworkoutapi.userexercise.UserExerciseMapper;
import com.avernet.myworkoutapi.userexercise.UserExerciseRepository;
import com.avernet.myworkoutapi.userexercise.UserExerciseService;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;


@SpringBootTest
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
@Sql(scripts = "/data.sql")
public class UserExerciseServiceTest {

    @Resource
    UserExerciseService service;

    @Resource
    UserExerciseRepository userExerciseRepository;

    @Resource
    UserRepository userRepository;

    @Resource
    MuscleGroupRepository muscleGroupRepository;

    @Resource
    ExerciseRepository exerciseRepository;

    @Resource
    UserMapper userMapper;

    @Resource
    ExerciseMapper exerciseMapper;

    @Resource
    UserExerciseMapper userExerciseMapper;


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

        List<UserExercise> userExerciseList = service.findAddedExercisesByMuscleGroupId(userEntity, muscleGroupEntity.getId());
        assertFalse(userExerciseList.isEmpty());
        assertEquals(3, userExerciseList.size());
    }

    @Test
    void createOrDelete_shouldCreateUserExercise() {
        UserExercise userExercise1 = service.createOrDelete(userEntity, exerciseMapper.toDto(exerciseEntity));
        assertNotNull(userExercise1);
        assertEquals(1, userExercise1.getOrder());
        Boolean userExerciseEntity = userExerciseRepository.existsByExerciseAndUser(exerciseEntity, userEntity);
        assertTrue(userExerciseEntity);

        UserExercise userExercise2 = service.createOrDelete(userEntity, exerciseMapper.toDto(exerciseEntity2));
        assertNotNull(userExercise2);
        assertEquals(2, userExercise2.getOrder());
        Boolean userExerciseEntity2 = userExerciseRepository.existsByExerciseAndUser(exerciseEntity, userEntity);
        assertTrue(userExerciseEntity2);

        UserExercise userExercise3 = service.createOrDelete(userEntity, exerciseMapper.toDto(exerciseEntity3));
        assertNotNull(userExercise3);
        assertEquals(3, userExercise3.getOrder());
        Boolean userExerciseEntity3 = userExerciseRepository.existsByExerciseAndUser(exerciseEntity, userEntity);
        assertTrue(userExerciseEntity3);
    }

    @Test
    void createOrDelete_shouldDeleteUserExercise() {
        ExerciseEntity exerciseEntity = exerciseRepository.findById(1L).orElseThrow(ExerciseNotFoundException::new);

        UserExercise userExercise = UserExercise.builder()
            .user(userMapper.toDto(userEntity))
            .exercise(exerciseMapper.toDto(exerciseEntity))
            .build();

        userExerciseRepository.save(userExerciseMapper.toEntity(userExercise));

        service.createOrDelete(userEntity, exerciseMapper.toDto(exerciseEntity));
        Boolean userExerciseEntity = userExerciseRepository.existsByExerciseAndUser(exerciseEntity, userEntity);
        assertFalse(userExerciseEntity);
    }

    @Test
    void updateOrderExercises_shouldReorganiseOrderExercise() {
        UserExercise userExercise = UserExercise.builder()
            .exercise(exerciseMapper.toDto(exerciseEntity))
            .order(1)
            .build();
        UserExercise userExercise2 = UserExercise.builder()
            .exercise(exerciseMapper.toDto(exerciseEntity2))
            .order(2)
            .build();

        UserExercise userExercise3 = UserExercise.builder()
            .exercise(exerciseMapper.toDto(exerciseEntity3))
            .order(3)
            .build();

        List<UserExercise> userExerciseList = new ArrayList<>(List.of(userExercise, userExercise2, userExercise3));

        service.updateOrderExercises(userEntity, userExerciseList);
    }
}

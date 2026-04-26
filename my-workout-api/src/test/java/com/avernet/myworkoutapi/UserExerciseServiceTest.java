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
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
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
    private UserExerciseMapper userExerciseMapper;


    @Test
    void shouldFindAddedExercisesExceptExerciseNotLinkedToMuscleGroupSelected() {
        UserEntity userEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);
        MuscleGroupEntity muscleGroupEntity = muscleGroupRepository.findById(1L).orElseThrow(MuscleGroupNotFoundException::new);

        ExerciseEntity exerciseEntity1 = exerciseRepository.findById(1L).orElseThrow(ExerciseNotFoundException::new);
        ExerciseEntity exerciseEntity2 = exerciseRepository.findById(2L).orElseThrow(ExerciseNotFoundException::new);
        ExerciseEntity exerciseEntity3 = exerciseRepository.findById(3L).orElseThrow(ExerciseNotFoundException::new);
        ExerciseEntity exerciseEntity4 = exerciseRepository.findById(20L).orElseThrow(ExerciseNotFoundException::new); /*Exercise is not linked to the muscle group 1*/

        UserExerciseEntity userExerciseEntity1 = UserExerciseEntity.builder().order(1).user(userEntity).exercise(exerciseEntity1).build();
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
    void shouldCreateOrDeleteUserExercise() {
        UserEntity userEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);
        ExerciseEntity exerciseEntity = exerciseRepository.findById(1L).orElseThrow(ExerciseNotFoundException::new);

        service.createOrDelete(userEntity, exerciseMapper.toDto(exerciseEntity));
        Boolean userExerciseEntity = userExerciseRepository.existsByExerciseAndUser(exerciseEntity, userEntity);
        assertTrue(userExerciseEntity);
    }

    @Test
    void shouldDeleteUserExercise() {
        UserEntity userEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);
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
}

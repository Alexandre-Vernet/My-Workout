package com.avernet.myworkoutapi;

import com.avernet.myworkoutapi.exercise.ExerciseEntity;
import com.avernet.myworkoutapi.exercise.ExerciseRepository;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupEntity;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupExerciseCount;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupRepository;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupService;
import com.avernet.myworkoutapi.user.UserEntity;
import com.avernet.myworkoutapi.user.UserRepository;
import com.avernet.myworkoutapi.userexercise.UserExerciseEntity;
import com.avernet.myworkoutapi.userexercise.UserExerciseRepository;
import com.avernet.myworkoutapi.workout.WorkoutEntity;
import com.avernet.myworkoutapi.workout.WorkoutRepository;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.jdbc.Sql;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
@Sql(scripts = "/data.sql")
public class MuscleGroupServiceTest {

    @Resource
    MuscleGroupService service;

    @Resource
    UserRepository userRepository;

    @Resource
    UserExerciseRepository userExerciseRepository;

    @Resource
    ExerciseRepository exerciseRepository;

    @Resource
    WorkoutRepository workoutRepository;

    @Resource
    MuscleGroupRepository muscleGroupRepository;


    @Test()
    void shouldGetMuscleGroup() {
        assertEquals(8, service.findAll().size());
        assertFalse(service.findAll().isEmpty());
    }

    @Test()
    void shouldGetAllMuscleGroupWithOnlyOneExerciseForUser() {
        UserEntity userEntity = UserEntity.builder().email("blabla@gmail.com").password("bla bla").build();
        userRepository.save(userEntity);

        ExerciseEntity exerciseEntity = exerciseRepository.findById(1L).orElse(null);

        UserExerciseEntity userExerciseEntity = UserExerciseEntity.builder()
            .user(userEntity)
            .exercise(exerciseEntity)
            .build();
        userExerciseRepository.save(userExerciseEntity);

        MuscleGroupEntity muscleGroupEntity = muscleGroupRepository.findById(1L).orElse(null);

        WorkoutEntity workoutEntity = WorkoutEntity.builder()
            .user(userEntity)
            .muscleGroup(muscleGroupEntity)
            .date(LocalDate.now())
            .build();

        workoutRepository.save(workoutEntity);

        List<MuscleGroupExerciseCount> muscleGroupExerciseCountList = service.findAllMuscleGroupAndRecommendedMuscleGroup(userEntity);
        assertFalse(muscleGroupExerciseCountList.isEmpty());
        assertEquals(8, muscleGroupExerciseCountList.size());
    }

    @Test()
    void shouldRecommendOlderMuscleGroup() {
        UserEntity userEntity = UserEntity.builder().email("blabla@gmail.com").password("password").build();
        userRepository.save(userEntity);

        for (int i = 1; i < 10; i++) {
            ExerciseEntity exerciseEntity = exerciseRepository.findById((long) i).orElse(null);
            UserExerciseEntity userExerciseEntity = UserExerciseEntity.builder()
                .user(userEntity)
                .exercise(exerciseEntity)
                .build();
            userExerciseRepository.save(userExerciseEntity);
        }


        for (int i = 1; i < 7; i++) {
            MuscleGroupEntity muscleGroupEntity = muscleGroupRepository.findById((long) i).orElse(null);

            WorkoutEntity workoutEntity = WorkoutEntity.builder()
                .user(userEntity)
                .muscleGroup(muscleGroupEntity)
                .date(LocalDate.now().plusDays(1L))
                .build();

            workoutRepository.save(workoutEntity);
        }

        List<MuscleGroupExerciseCount> muscleGroupExerciseCountList = service.findAllMuscleGroupAndRecommendedMuscleGroup(userEntity);
        assertEquals(8, muscleGroupExerciseCountList.size());
        assertFalse(muscleGroupExerciseCountList.isEmpty());
        assertEquals(1, muscleGroupExerciseCountList.get(0).getMuscleGroup().id());
    }

    @Test()
    void shouldNotCrashWithMultipleWorkoutWithSameDateAndSuggestRandomMuscleGroup() {
        UserEntity userEntity = UserEntity.builder().email("blabla@gmail.com").password("password").build();
        userRepository.save(userEntity);

        for (int i = 1; i < 10; i++) {
            ExerciseEntity exerciseEntity = exerciseRepository.findById((long) i).orElse(null);
            UserExerciseEntity userExerciseEntity = UserExerciseEntity.builder()
                .user(userEntity)
                .exercise(exerciseEntity)
                .build();
            userExerciseRepository.save(userExerciseEntity);
        }


        for (int i = 1; i < 7; i++) {
            MuscleGroupEntity muscleGroupEntity = muscleGroupRepository.findById((long) i).orElse(null);

            WorkoutEntity workoutEntity = WorkoutEntity.builder()
                .user(userEntity)
                .muscleGroup(muscleGroupEntity)
                .date(LocalDate.now())
                .build();

            workoutRepository.save(workoutEntity);
        }

        List<MuscleGroupExerciseCount> muscleGroupExerciseCountList = service.findAllMuscleGroupAndRecommendedMuscleGroup(userEntity);
        assertEquals(8, muscleGroupExerciseCountList.size());
        assertFalse(muscleGroupExerciseCountList.isEmpty());
        assertEquals(1, muscleGroupExerciseCountList.get(0).getMuscleGroup().id());
    }
}

package com.avernet.myworkoutapi;

import com.avernet.myworkoutapi.exercise.ExerciseEntity;
import com.avernet.myworkoutapi.exercise.ExerciseNotFoundException;
import com.avernet.myworkoutapi.exercise.ExerciseRepository;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupEntity;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupEnum;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupExerciseCount;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupNotFoundException;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupRepository;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupService;
import com.avernet.myworkoutapi.user.UserEntity;
import com.avernet.myworkoutapi.user.UserNotFoundException;
import com.avernet.myworkoutapi.user.UserRepository;
import com.avernet.myworkoutapi.userexercise.UserExerciseEntity;
import com.avernet.myworkoutapi.userexercise.UserExerciseRepository;
import com.avernet.myworkoutapi.workout.WorkoutEntity;
import com.avernet.myworkoutapi.workout.WorkoutRepository;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@ActiveProfiles("test")
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
    }

    @Test()
    void findAllMuscleGroupAndRecommendedMuscleGroup_shouldRecommendNullLastWorkout() {
        UserEntity userEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);

        for (int i = 1; i < 10; i++) {
            ExerciseEntity exerciseEntity = exerciseRepository.findById((long) i).orElseThrow(ExerciseNotFoundException::new);
            UserExerciseEntity userExerciseEntity = UserExerciseEntity.builder()
                .user(userEntity)
                .exercise(exerciseEntity)
                .build();
            userExerciseRepository.save(userExerciseEntity);
        }


        for (int i = 1; i <= 7; i++) {
            MuscleGroupEntity muscleGroupEntity = muscleGroupRepository.findById((long) i).orElseThrow(MuscleGroupNotFoundException::new);

            WorkoutEntity workoutEntity = WorkoutEntity.builder()
                .user(userEntity)
                .muscleGroup(muscleGroupEntity)
                .date(LocalDate.now().minusDays(i))
                .build();

            workoutRepository.save(workoutEntity);
        }

        List<MuscleGroupExerciseCount> muscleGroupExerciseCountList = service.findAllMuscleGroupAndRecommendedMuscleGroup(userEntity);
        assertEquals(8, muscleGroupExerciseCountList.size());
        assertEquals(8, muscleGroupExerciseCountList.get(0).getMuscleGroup().id());
        assertEquals(7, muscleGroupExerciseCountList.get(1).getMuscleGroup().id());
        assertEquals(6, muscleGroupExerciseCountList.get(2).getMuscleGroup().id());
        assertEquals(5, muscleGroupExerciseCountList.get(3).getMuscleGroup().id());
        assertEquals(4, muscleGroupExerciseCountList.get(4).getMuscleGroup().id());
        assertEquals(3, muscleGroupExerciseCountList.get(5).getMuscleGroup().id());
        assertEquals(2, muscleGroupExerciseCountList.get(6).getMuscleGroup().id());
        assertEquals(1, muscleGroupExerciseCountList.get(7).getMuscleGroup().id());
    }

    @Test()
    void findAllMuscleGroupAndRecommendedMuscleGroup_shouldNotCrashWithMultipleWorkoutWithSameDateAndSuggestNullLastWorkout() {
        UserEntity userEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);

        for (int i = 1; i < 10; i++) {
            ExerciseEntity exerciseEntity = exerciseRepository.findById((long) i).orElseThrow(ExerciseNotFoundException::new);
            UserExerciseEntity userExerciseEntity = UserExerciseEntity.builder()
                .user(userEntity)
                .exercise(exerciseEntity)
                .build();
            userExerciseRepository.save(userExerciseEntity);
        }


        for (int i = 1; i <= 7; i++) {
            MuscleGroupEntity muscleGroupEntity = muscleGroupRepository.findById((long) i).orElseThrow(MuscleGroupNotFoundException::new);

            WorkoutEntity workoutEntity = WorkoutEntity.builder()
                .user(userEntity)
                .muscleGroup(muscleGroupEntity)
                .date(LocalDate.now())
                .build();

            workoutRepository.save(workoutEntity);
        }

        List<MuscleGroupExerciseCount> muscleGroupExerciseCountList = service.findAllMuscleGroupAndRecommendedMuscleGroup(userEntity);
        assertEquals(8, muscleGroupExerciseCountList.size());
        assertEquals(8, muscleGroupExerciseCountList.getFirst().getMuscleGroup().id());
    }

    @Test
    void findAllMuscleGroupAndRecommendedMuscleGroup_shouldOrderByName() {
        UserEntity userEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);

        List<MuscleGroupExerciseCount> muscleGroupExerciseCountList = service.findAllMuscleGroupAndRecommendedMuscleGroup(userEntity);

        assertEquals(8, muscleGroupExerciseCountList.size());
        assertEquals(1, muscleGroupExerciseCountList.get(0).getMuscleGroup().id());
        assertEquals(2, muscleGroupExerciseCountList.get(1).getMuscleGroup().id());
        assertEquals(3, muscleGroupExerciseCountList.get(2).getMuscleGroup().id());
        assertEquals(4, muscleGroupExerciseCountList.get(3).getMuscleGroup().id());
        assertEquals(5, muscleGroupExerciseCountList.get(4).getMuscleGroup().id());
        assertEquals(6, muscleGroupExerciseCountList.get(5).getMuscleGroup().id());
        assertEquals(7, muscleGroupExerciseCountList.get(6).getMuscleGroup().id());
    }

    @Test
    void findAllMuscleGroupAndRecommendedMuscleGroup_shouldFinExerciseByMuscleGroup() {
        MuscleGroupEntity muscleGroupEntity = muscleGroupRepository.findByExercise(1L);
        assertEquals(MuscleGroupEnum.PECTORAUX, muscleGroupEntity.getName());

        MuscleGroupEntity muscleGroupEntity2 = muscleGroupRepository.findByExercise(9L);
        assertEquals(MuscleGroupEnum.JAMBES, muscleGroupEntity2.getName());

        MuscleGroupEntity muscleGroupEntity3 = muscleGroupRepository.findByExercise(14L);
        assertEquals(MuscleGroupEnum.EPAULES, muscleGroupEntity3.getName());

        MuscleGroupEntity muscleGroupEntity4 = muscleGroupRepository.findByExercise(19L);
        assertEquals(MuscleGroupEnum.BICEPS, muscleGroupEntity4.getName());

        MuscleGroupEntity muscleGroupEntity5 = muscleGroupRepository.findByExercise(25L);
        assertEquals(MuscleGroupEnum.ABDOMINAUX, muscleGroupEntity5.getName());

        MuscleGroupEntity muscleGroupEntity6 = muscleGroupRepository.findByExercise(28L);
        assertEquals(MuscleGroupEnum.CARDIO, muscleGroupEntity6.getName());

        MuscleGroupEntity muscleGroupEntity7 = muscleGroupRepository.findByExercise(6L);
        assertEquals(MuscleGroupEnum.TRICEPS, muscleGroupEntity7.getName());

        MuscleGroupEntity muscleGroupEntity8 = muscleGroupRepository.findByExercise(16L);
        assertEquals(MuscleGroupEnum.DOS, muscleGroupEntity8.getName());
    }
}

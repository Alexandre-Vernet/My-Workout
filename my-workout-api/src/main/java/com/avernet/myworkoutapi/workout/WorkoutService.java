package com.avernet.myworkoutapi.workout;

import com.avernet.myworkoutapi.auth.AuthService;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupType;
import com.avernet.myworkoutapi.user.UserEntity;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class WorkoutService {

    @Resource
    WorkoutRepository workoutRepository;

    @Resource
    AuthService authService;

    @Resource
    WorkoutMapper workoutMapper;

    Workout createWorkout(Workout workout) {
        UserEntity userEntity = authService.getCurrentUserEntity();
        if (workout.getMuscleGroup().name() != MuscleGroupType.CARDIO) {
            // Do not create a workout if it already exists for the same user and muscle group on the same day
            // Except cardio workout because it can be done multiple times a day with different exercises (e.g. running, cycling)
            Optional<WorkoutEntity> existingWorkout = checkDuplicateWorkout(userEntity, workout);
            if (existingWorkout.isPresent()) {
                return workoutMapper.toDto(existingWorkout.get());
            }
        }

        workout.setUser(authService.getCurrentUserDto());
        WorkoutEntity workoutEntity = workoutRepository.save(workoutMapper.toEntity(workout));
        return workoutMapper.toDto(workoutEntity);
    }

    List<Workout> findByDate(String start, String end) {
        UserEntity userEntity = authService.getCurrentUserEntity();
        List<WorkoutEntity> workoutEntityList = workoutRepository.findByUserIdAndDateBetween(userEntity.getId(), LocalDate.parse(start), LocalDate.parse(end));
        return workoutMapper.toDtoList(workoutEntityList);
    }

    Integer countTotalDaysWorkout() {
        UserEntity userEntity = authService.getCurrentUserEntity();
       return workoutRepository.countByUserId(userEntity.getId());
    }

    void delete(Long id) {
        UserEntity userEntity = authService.getCurrentUserEntity();
        workoutRepository.deleteByIdAndUserId(id, userEntity.getId());
    }

    private Optional<WorkoutEntity> checkDuplicateWorkout(UserEntity userEntity, Workout workout) {
        return workoutRepository.findByUserIdAndMuscleGroupIdAndDate(userEntity.getId(), workout.getMuscleGroup().id(), workout.getDate());
    }
}

package com.avernet.myworkoutapi.workout;

import com.avernet.myworkoutapi.history.HistoryEntity;
import com.avernet.myworkoutapi.history.HistoryGroup;
import com.avernet.myworkoutapi.history.HistoryMapper;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupType;
import com.avernet.myworkoutapi.user.UserEntity;
import jakarta.annotation.Resource;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WorkoutService {

    @Resource
    WorkoutRepository workoutRepository;

    @Resource
    WorkoutMapper workoutMapper;

    @Resource
    HistoryMapper historyMapper;


    @Transactional
    Workout createWorkout(UserEntity userEntity, WorkoutRequest workoutRequest) {
        WorkoutEntity workoutEntity = workoutMapper.toEntity(workoutRequest.getWorkout());

        if (workoutRequest.getWorkout().getMuscleGroup().name() != MuscleGroupType.CARDIO) {
            // Do not create a workout if it already exists for the same user and muscle group on the same day
            // Except cardio workout because it can be done multiple times a day with different exercises (e.g. running, cycling)
            Optional<WorkoutEntity> existingWorkout = workoutRepository.findByUserIdAndMuscleGroupIdAndDate(userEntity.getId(),
                workoutRequest.getWorkout().getMuscleGroup().id(),
                workoutRequest.getWorkout().getDate());
            if (existingWorkout.isPresent()) {
                workoutEntity = existingWorkout.get();
            }
        }

        workoutEntity.setUser(userEntity);

        HistoryEntity historyEntity = historyMapper.toEntity(workoutRequest.getHistory());
        historyEntity.setWorkout(workoutEntity);

        workoutEntity.getHistories().add(historyEntity);

        workoutRepository.save(workoutEntity);
        return workoutMapper.toDto(workoutEntity);
    }

    WorkoutGroupedHistories find(Long id) {
        Workout workout = workoutMapper.toDto(workoutRepository.findById(id).orElse(null));

        List<HistoryGroup> historyGroupList = workout.getHistories().stream()
            .collect(Collectors.groupingBy(h -> h.getExercise().getId()))
            .values()
            .stream()
            .map(historyList -> new HistoryGroup(
                historyList.get(0).getExercise(),
                historyList
            ))
            .toList();

        return WorkoutGroupedHistories.builder()
            .workout(workout)
            .historyGroups(historyGroupList)
            .muscleGroup(workout.getMuscleGroup())
            .build();
    }

    List<Workout> findByDate(UserEntity userEntity, String start, String end) {
        List<WorkoutEntity> workoutEntityList = workoutRepository.findByUserIdAndDateBetween(userEntity.getId(), LocalDate.parse(start), LocalDate.parse(end));
        return workoutMapper.toDtoList(workoutEntityList);
    }

    Integer countTotalDaysWorkout(UserEntity userEntity) {
       return workoutRepository.countByUserId(userEntity.getId());
    }

    @Transactional
    void delete(UserEntity userEntity, Long id) {
        workoutRepository.deleteByIdAndUserId(id, userEntity.getId());
    }
}

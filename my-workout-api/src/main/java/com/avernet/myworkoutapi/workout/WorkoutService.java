package com.avernet.myworkoutapi.workout;

import com.avernet.myworkoutapi.exception.ApiException;
import com.avernet.myworkoutapi.exception.ErrorCodeEnum;
import com.avernet.myworkoutapi.history.HistoryEntity;
import com.avernet.myworkoutapi.history.HistoryGroup;
import com.avernet.myworkoutapi.history.HistoryMapper;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupType;
import com.avernet.myworkoutapi.user.UserEntity;
import jakarta.annotation.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public Workout createWorkout(UserEntity userEntity, WorkoutRequest workoutRequest) {
        WorkoutEntity workoutEntity = workoutMapper.toEntity(workoutRequest.workout());

        if (workoutRequest.workout().getMuscleGroup().name() != MuscleGroupType.CARDIO) {
            // Do not create a workout if it already exists for the same user and muscle group on the same day
            // Except cardio workout because it can be done multiple times a day with different exercises (e.g. running, cycling)
            Optional<WorkoutEntity> existingWorkout = workoutRepository.findByUserIdAndMuscleGroupIdAndDate(userEntity.getId(),
                workoutRequest.workout().getMuscleGroup().id(),
                workoutRequest.workout().getDate());
            if (existingWorkout.isPresent()) {
                workoutEntity = existingWorkout.get();
            }
        }

        workoutEntity.setUser(userEntity);

        HistoryEntity historyEntity = historyMapper.toEntity(workoutRequest.history());
        historyEntity.setWorkout(workoutEntity);

        workoutEntity.getHistories().add(historyEntity);

        workoutRepository.save(workoutEntity);
        return workoutMapper.toDto(workoutEntity);
    }

    @Transactional(readOnly = true)
    public WorkoutGroupedHistories find(UserEntity userEntity, Long id) {
        Optional<WorkoutEntity> workoutEntity = workoutRepository.findByIdAndUser(id, userEntity);
        if (workoutEntity.isEmpty()) {
            throw new ApiException(ErrorCodeEnum.WORKOUT_NOT_FOUND, "Cette séance n'existe pas", HttpStatus.NOT_FOUND);
        }
        Workout workout = workoutMapper.toDto(workoutEntity.get());

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

    @Transactional(readOnly = true)
    public List<Workout> findByDate(UserEntity userEntity, String start, String end) {
        List<WorkoutEntity> workoutEntityList = workoutRepository.findByUserIdAndDateBetween(userEntity.getId(), LocalDate.parse(start), LocalDate.parse(end));
        return workoutMapper.toDtoList(workoutEntityList);
    }

    @Transactional
    public void delete(UserEntity userEntity, Long id) {
        workoutRepository.deleteByIdAndUserId(id, userEntity.getId());
    }
}

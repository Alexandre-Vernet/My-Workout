package com.avernet.myworkoutapi.workout;

import com.avernet.myworkoutapi.error.ErrorCodeEnum;
import com.avernet.myworkoutapi.exception.ApiException;
import com.avernet.myworkoutapi.history.History;
import com.avernet.myworkoutapi.history.HistoryEntity;
import com.avernet.myworkoutapi.history.HistoryGroup;
import com.avernet.myworkoutapi.history.HistoryMapper;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupEnum;
import com.avernet.myworkoutapi.user.UserEntity;
import jakarta.annotation.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
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
    public Workout createWorkout(UserEntity user, WorkoutRequest request) {
        WorkoutEntity workoutEntity = resolveWorkout(user, request);

        HistoryEntity history = createHistory(request, workoutEntity);

        addHistory(workoutEntity, history);

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
            .map(historyList -> {
                historyList.sort(Comparator.comparing(History::getId));

                return new HistoryGroup(
                    historyList.getFirst().getExercise(),
                    historyList
                );
            })
            .sorted(Comparator.comparing(
                historyGroup -> historyGroup.getHistories().getFirst().getId()
            ))
            .toList();

        return WorkoutGroupedHistories.builder()
            .workoutSummary(new WorkoutSummary(workout.getId(), workout.getDate(), workout.getDuration()))
            .historyGroups(historyGroupList)
            .muscleGroup(workout.getMuscleGroup())
            .build();
    }

    @Transactional(readOnly = true)
    public List<Workout> findByDate(UserEntity userEntity, String start, String end) {
        List<WorkoutEntity> workoutEntityList = workoutRepository.findByUserIdAndDateBetween(
            userEntity.getId(),
            LocalDate.parse(start).atStartOfDay(),
            LocalDate.parse(end).atStartOfDay()
        );
        return workoutMapper.toDtoList(workoutEntityList);
    }

    @Transactional
    public void delete(UserEntity userEntity, Long id) {
        workoutRepository.deleteByIdAndUserId(id, userEntity.getId());
    }


    private WorkoutEntity resolveWorkout(UserEntity user, WorkoutRequest request) {
        WorkoutEntity workoutEntity = workoutMapper.toEntity(request.workout());
        workoutEntity.setUser(user);

        if (isCardio(request)) {
            return workoutEntity;
        }

        return findOrCreateWorkout(user, request, workoutEntity);
    }

    private boolean isCardio(WorkoutRequest request) {
        return request.workout()
            .getMuscleGroup()
            .id()
            .equals(MuscleGroupEnum.CARDIO.getId());
    }

    private WorkoutEntity findOrCreateWorkout(UserEntity user,WorkoutRequest request,WorkoutEntity newWorkout) {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        return workoutRepository
            .findByUserIdAndMuscleGroupIdAndDateGreaterThanEqualAndDateLessThan(
                user.getId(),
                request.workout().getMuscleGroup().id(),
                start,
                end
            )
            .orElse(newWorkout);
    }

    private HistoryEntity createHistory(WorkoutRequest request, WorkoutEntity workout) {
        HistoryEntity history = historyMapper.toEntity(request.history());
        history.setWorkout(workout);

        if (isCardio(request)) {
            history.setUnilateral(false);
        }

        return history;
    }

    private void addHistory(WorkoutEntity workout, HistoryEntity history) {
        if (workout.getHistories() == null) {
            workout.setHistories(new ArrayList<>());
        }
        workout.getHistories().add(history);
    }
}

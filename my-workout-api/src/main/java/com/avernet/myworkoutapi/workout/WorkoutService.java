package com.avernet.myworkoutapi.workout;

import com.avernet.myworkoutapi.error.ErrorCodeEnum;
import com.avernet.myworkoutapi.exception.ApiException;
import com.avernet.myworkoutapi.gym.Gym;
import com.avernet.myworkoutapi.gym.GymEntity;
import com.avernet.myworkoutapi.gym.GymRepository;
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

    @Resource
    GymRepository gymRepository;


    @Transactional
    public Workout createWorkout(UserEntity user, WorkoutRequest request) {
       WorkoutEntity workoutEntity = findOrCreateWorkout(user, request);

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
            .workoutSummary(new WorkoutSummary(workout.getId(), workout.getDate()))
            .historyGroups(historyGroupList)
            .muscleGroup(workout.getMuscleGroup())
            .gym(workout.getGym())
            .build();
    }

    @Transactional(readOnly = true)
    public List<Workout> findByDate(UserEntity userEntity, LocalDate start, LocalDate end) {
        List<WorkoutEntity> workoutEntityList = workoutRepository.findByUserIdAndDateBetween(
            userEntity.getId(),
            start.atStartOfDay(),
            end.atStartOfDay()
        );
        return workoutMapper.toDtoList(workoutEntityList);
    }

    @Transactional
    public void delete(UserEntity userEntity, Long id) {
        workoutRepository.deleteByIdAndUserId(id, userEntity.getId());
    }


    private boolean isCardio(WorkoutRequest request) {
        return request.workout()
            .getMuscleGroup()
            .id()
            .equals(MuscleGroupEnum.CARDIO.getId());
    }

    private WorkoutEntity findOrCreateWorkout(UserEntity user, WorkoutRequest request) {
        WorkoutEntity workoutEntity = workoutMapper.toEntity(request.workout());
        workoutEntity.setUser(user);

        GymEntity gymEntity = resolveGym(user, request.workout().getGym());
        workoutEntity.setGym(gymEntity);

        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        WorkoutEntity existingOrNewWorkout = workoutRepository
            .findByUserIdAndMuscleGroupIdAndDateGreaterThanEqualAndDateLessThan(
                user.getId(),
                request.workout().getMuscleGroup().id(),
                start,
                end
            )
            .orElse(workoutEntity);

        existingOrNewWorkout.setGym(gymEntity);

        return existingOrNewWorkout;
    }

    // Never trust the nested Gym object straight from the request: it only carries an id,
    // and the gym table is per-user, so a client could otherwise link a workout to any
    // other user's gym by guessing its id. gym_id is NOT NULL on workout, so a missing
    // gym must be rejected cleanly here rather than surfacing as a raw DB constraint
    // violation (the frontend is expected to block starting a workout before this point
    // when the user has no gym, but this stays the real guarantee).
    private GymEntity resolveGym(UserEntity user, Gym gym) {
        if (gym == null || gym.id() == null) {
            throw new ApiException(ErrorCodeEnum.GYM_REQUIRED, "Vous devez créer une salle avant de commencer un entraînement", HttpStatus.BAD_REQUEST);
        }

        return gymRepository.findByIdAndUser(gym.id(), user)
            .orElseThrow(() -> new ApiException(ErrorCodeEnum.GYM_NOT_FOUND, "Cette salle n'existe pas", HttpStatus.NOT_FOUND));
    }

    private HistoryEntity createHistory(WorkoutRequest request, WorkoutEntity workout) {
        HistoryEntity history = historyMapper.toEntity(request.history());
        history.setWorkout(workout);

        if (isCardio(request)) {
            history.setUnilateral(false);
            history.setReps(null);
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

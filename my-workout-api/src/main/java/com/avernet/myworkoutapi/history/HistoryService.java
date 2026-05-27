package com.avernet.myworkoutapi.history;

import com.avernet.myworkoutapi.exception.ApiException;
import com.avernet.myworkoutapi.error.ErrorCodeEnum;
import com.avernet.myworkoutapi.exercise.ExerciseEntity;
import com.avernet.myworkoutapi.exercise.ExerciseMapper;
import com.avernet.myworkoutapi.exercise.ExerciseRepository;
import com.avernet.myworkoutapi.history.stats.HistoryPoint;
import com.avernet.myworkoutapi.history.stats.UserExercisesCountTotalWorkout;
import com.avernet.myworkoutapi.history.stats.exercisegraphs.ExerciseGraphs;
import com.avernet.myworkoutapi.history.stats.exercisegraphs.ExerciseGraphsEntity;
import com.avernet.myworkoutapi.user.UserEntity;
import com.avernet.myworkoutapi.workout.WorkoutEntity;
import com.avernet.myworkoutapi.workout.WorkoutRepository;
import jakarta.annotation.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class HistoryService {

    @Resource
    HistoryRepository historyRepository;

    @Resource
    WorkoutRepository workoutRepository;

    @Resource
    ExerciseRepository exerciseRepository;

    @Resource
    HistoryMapper historyMapper;

    @Resource
    private ExerciseMapper exerciseMapper;


    @Transactional(readOnly = true)
    public History findLastHistoryWeightByExerciseId(UserEntity userEntity, Long exerciseId) {
        HistoryEntity historyEntity = historyRepository.findFirstByExerciseIdAndWorkoutUserIdOrderByWorkoutDate(userEntity.getId(), exerciseId);
        return historyMapper.toDto(historyEntity);
    }

    @Transactional(readOnly = true)
    public List<History> findTodayHistories(UserEntity userEntity, Long muscleGroupId, Long exerciseId) {
        LocalDate now = LocalDate.now();
        LocalDateTime startOfDay = now.atStartOfDay();
        LocalDateTime endOfDay = now.plusDays(1).atStartOfDay();

        List<HistoryEntity> historyEntity = historyRepository.findTodayHistories(userEntity.getId(), muscleGroupId, exerciseId, startOfDay, endOfDay);
        return historyMapper.toDtoList(historyEntity);
    }

    @Transactional(readOnly = true)
    public UserExercisesCountTotalWorkout getGlobalStatsWithListExercises(UserEntity userEntity) {
        Long countTotalDaysWorkout = workoutRepository.countByUserId(userEntity.getId());
        List<ExerciseEntity> exerciseEntityList = exerciseRepository.findExercisesByUser(userEntity.getId());
        return new UserExercisesCountTotalWorkout(
            countTotalDaysWorkout,
            exerciseMapper.toDtoList(exerciseEntityList)
        );
    }

    @Transactional(readOnly = true)
    public ExerciseGraphs getExerciseGraphs(UserEntity userEntity, Long exerciseId) {
        ExerciseGraphsEntity exerciseGraphsEntity = historyRepository.getExerciseGraphs(userEntity.getId(), exerciseId);
        List<HistoryEntity> historyEntityList = historyRepository.findHistoriesByUserAndExercise(userEntity.getId(), exerciseId);

        List<HistoryPoint> historyPoints = new ArrayList<>();

        Float lastWeight = null;

        for (HistoryEntity h : historyEntityList.stream().toList()) {
            Float currentWeight = h.getWeight();

            if (!Objects.equals(currentWeight, lastWeight)) {
                historyPoints.add(new HistoryPoint(currentWeight, h.getWorkout().getDate()));
                lastWeight = currentWeight;
            }
        }

        return new ExerciseGraphs(
            exerciseMapper.toDto(exerciseGraphsEntity.exercise()),
            historyPoints,
            exerciseGraphsEntity.totalWeight(),
            exerciseGraphsEntity.maxWeight(),
            exerciseGraphsEntity.totalReps()
        );
    }

    @Transactional
    public History update(Long historyId, History history) {
        HistoryEntity historyEntity = historyRepository.findById(historyId)
            .orElseThrow(() -> new ApiException(ErrorCodeEnum.HISTORY_NOT_FOUND, "Cet historique n'existe pas", HttpStatus.NOT_FOUND));

        if (history.getWeight() == null || history.getWeight() == 0) {
            historyEntity.setWeight(null);
        } else {
            historyEntity.setWeight(history.weight);
        }

        if (history.getReps() != null) {
            historyEntity.setReps(history.reps);
        }

        if (history.getUnilateral() != null) {
            historyEntity.setUnilateral(history.getUnilateral());
        }


        return historyMapper.toDto(historyEntity);
    }

    @Transactional
    public void delete(Long historyId) {
        HistoryEntity historyEntity = historyRepository.findById(historyId)
            .orElseThrow(() -> new ApiException(ErrorCodeEnum.HISTORY_NOT_FOUND, "Cet historique n'existe pas", HttpStatus.NOT_FOUND));

        WorkoutEntity workoutEntity = historyEntity.getWorkout();
        workoutEntity.getHistories().remove(historyEntity);

        if (workoutEntity.getHistories().isEmpty()) {
            workoutRepository.delete(workoutEntity);
        }
    }
}

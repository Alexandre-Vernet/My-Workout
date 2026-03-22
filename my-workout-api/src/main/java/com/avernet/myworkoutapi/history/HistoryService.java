package com.avernet.myworkoutapi.history;

import com.avernet.myworkoutapi.auth.AuthService;
import com.avernet.myworkoutapi.exception.ApiException;
import com.avernet.myworkoutapi.exception.ErrorCodeEnum;
import com.avernet.myworkoutapi.user.UserEntity;
import com.avernet.myworkoutapi.workout.WorkoutEntity;
import com.avernet.myworkoutapi.workout.WorkoutRepository;
import jakarta.annotation.Resource;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class HistoryService {

    @Resource
    HistoryRepository historyRepository;

    @Resource
    WorkoutRepository workoutRepository;

    @Resource
    AuthService authService;

    @Resource
    HistoryMapper historyMapper;

    History findLastHistoryWeightByExerciseId(Long exerciseId) {
        UserEntity userEntity = authService.getCurrentUserEntity();
        HistoryEntity historyEntity = historyRepository.findFirstByExerciseIdAndWorkoutUserIdOrderByWorkoutDate(userEntity.getId(), exerciseId);
        return historyMapper.toDto(historyEntity);
    }

    List<History> findTodayExercices(Long muscleGroupId, Long exerciseId) {
        UserEntity userEntity = authService.getCurrentUserEntity();
        LocalDate now = LocalDate.now();

        List<HistoryEntity> historyEntity = historyRepository.findTodayExercices(userEntity.getId(), muscleGroupId, exerciseId, now);
        return historyMapper.toDtoList(historyEntity);
    }

    History create(History history) {
        HistoryEntity historyEntity = historyMapper.toEntity(history);
        historyEntity = historyRepository.save(historyEntity);
        return historyMapper.toDto(historyEntity);
    }

    @Transactional
    History update(Long historyId, History history) {
        HistoryEntity historyEntity = historyRepository.findById(historyId)
            .orElseThrow(() -> new ApiException(ErrorCodeEnum.HISTORY_NOT_FOUND, "Cet historique n'existe pas", HttpStatus.BAD_REQUEST));

        if (!history.weight.equals(historyEntity.weight)) {
            historyEntity.weight = history.weight;
        }

        if (!history.reps.equals(historyEntity.reps)) {
            historyEntity.reps = history.reps;
        }

        if (history.weight == 0) {
            history.weight = null;
        }

        return historyMapper.toDto(historyEntity);
    }

    @Transactional
    void delete(Long historyId) {
        HistoryEntity historyEntity = historyRepository.findById(historyId)
            .orElseThrow(() -> new ApiException(ErrorCodeEnum.HISTORY_NOT_FOUND, "Cet historique n'existe pas", HttpStatus.BAD_REQUEST));

        WorkoutEntity workoutEntity = historyEntity.getWorkout();
        workoutEntity.getHistories().remove(historyEntity);

        if (workoutEntity.getHistories().isEmpty()) {
            workoutRepository.delete(workoutEntity);
        }
    }
}

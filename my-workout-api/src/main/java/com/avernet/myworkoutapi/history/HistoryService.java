package com.avernet.myworkoutapi.history;

import com.avernet.myworkoutapi.auth.AuthService;
import com.avernet.myworkoutapi.user.UserEntity;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class HistoryService {

    @Resource
    HistoryRepository historyRepository;

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
}

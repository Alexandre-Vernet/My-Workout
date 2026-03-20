package com.avernet.myworkoutapi.history;

import com.avernet.myworkoutapi.auth.AuthService;
import com.avernet.myworkoutapi.user.UserEntity;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

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
        HistoryEntity historyEntity = historyRepository.findFirstByExerciseIdAndWorkoutUserIdOrderByWorkoutDate(exerciseId, userEntity.getId());
        return historyMapper.toDto(historyEntity);
    }
}

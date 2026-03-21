package com.avernet.myworkoutapi.userexercise;

import com.avernet.myworkoutapi.auth.AuthService;
import com.avernet.myworkoutapi.user.UserEntity;
import jakarta.annotation.Resource;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserExerciseService {

    @Resource
    AuthService authService;

    @Resource
    UserExerciseRepository userExerciseRepository;

    @Resource
    UserExerciseMapper userExerciseMapper;


    UserExercise create(UserExercise userExercise) {
        UserEntity userEntity = authService.getCurrentUserEntity();

        UserExerciseEntity userExerciseEntity = userExerciseRepository.findByUserIdAndExerciseId(userEntity.getId(), userExercise.getExercise().getId());
        if (userExerciseEntity != null) {
            userExerciseRepository.delete(userExerciseEntity);
        } else {
            UserExerciseEntity userExerciseEntityToSave = userExerciseMapper.toEntity(userExercise);
            userExerciseEntityToSave.setUser(userEntity);
            userExerciseRepository.save(userExerciseEntityToSave);
        }

        return userExercise;
    }

    @Transactional
    void updateOrderExercises(List<UserExercise> userExerciseList) {
        UserEntity userEntity = authService.getCurrentUserEntity();

        userExerciseList.forEach(ue -> {
            UserExerciseEntity entity = userExerciseRepository.findByUserIdAndExerciseId(userEntity.getId(), ue.getExercise().getId());
            if (entity != null) {
                entity.setOrder(ue.getOrder());
                userExerciseRepository.save(entity);
            }
        });
    }
}

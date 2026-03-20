package com.avernet.myworkoutapi.userexercise;

import com.avernet.myworkoutapi.auth.AuthService;
import com.avernet.myworkoutapi.user.UserEntity;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

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
}

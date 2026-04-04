package com.avernet.myworkoutapi.userexercise;

import com.avernet.myworkoutapi.user.UserEntity;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserExerciseService {

    @Resource
    UserExerciseRepository userExerciseRepository;

    @Resource
    UserExerciseMapper userExerciseMapper;


    @Transactional(readOnly = true)
    public List<UserExercise> findAddedExercisesByMuscleGroupId(UserEntity userEntity, Integer muscleGroupId) {
        List<UserExerciseEntity> exerciseEntityList = userExerciseRepository.findAddedExercisesByMuscleGroupId(userEntity.getId(), muscleGroupId);
        return userExerciseMapper.toDtoList(exerciseEntityList);
    }

    @Transactional
    public UserExercise create(UserEntity userEntity, UserExercise userExercise) {
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
    public void updateOrderExercises(UserEntity userEntity, List<UserExercise> userExerciseList) {
        userExerciseList.forEach(ue -> {
            UserExerciseEntity entity = userExerciseRepository.findByUserIdAndExerciseId(userEntity.getId(), ue.getExercise().getId());
            if (entity != null) {
                entity.setOrder(ue.getOrder());
                userExerciseRepository.save(entity);
            }
        });
    }
}

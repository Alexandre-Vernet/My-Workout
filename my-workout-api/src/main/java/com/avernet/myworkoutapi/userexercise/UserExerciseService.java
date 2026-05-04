package com.avernet.myworkoutapi.userexercise;

import com.avernet.myworkoutapi.exercise.Exercise;
import com.avernet.myworkoutapi.exercise.ExerciseMapper;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupEntity;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupRepository;
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
    MuscleGroupRepository muscleGroupRepository;

    @Resource
    UserExerciseMapper userExerciseMapper;

    @Resource
    private ExerciseMapper exerciseMapper;


    @Transactional(readOnly = true)
    public List<UserExercise> findAddedExercisesByMuscleGroupId(UserEntity userEntity, Integer muscleGroupId) {
        List<UserExerciseEntity> exerciseEntityList = userExerciseRepository.findAddedExercisesByMuscleGroupId(userEntity.getId(), muscleGroupId);
        return userExerciseMapper.toDtoList(exerciseEntityList);
    }

    @Transactional
    public UserExercise createOrDelete(UserEntity userEntity, Exercise exercise) {
        UserExerciseEntity userExerciseEntity = userExerciseRepository.findByUserIdAndExerciseId(userEntity.getId(), exercise.getId());
        if (userExerciseEntity != null) {
            userExerciseRepository.delete(userExerciseEntity);
            return null;
        } else {
            MuscleGroupEntity muscleGroupEntity = muscleGroupRepository.findByExercise(exercise.getId());
            int order = userExerciseRepository.getOrder(userEntity.getId(), muscleGroupEntity.getId());
            UserExerciseEntity userExerciseEntityToSave = UserExerciseEntity.builder()
                .user(userEntity)
                .exercise(exerciseMapper.toEntity(exercise))
                .order(order)
                .build();
            return userExerciseMapper.toDto(userExerciseRepository.save(userExerciseEntityToSave));
        }
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

package com.avernet.myworkoutapi.exercise;

import com.avernet.myworkoutapi.auth.AuthService;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupNotFoundException;
import com.avernet.myworkoutapi.exercisemuscle.ExerciseMuscle;
import com.avernet.myworkoutapi.exercisemuscle.ExerciseMuscleEntity;
import com.avernet.myworkoutapi.muscle.MuscleEntity;
import com.avernet.myworkoutapi.muscle.MuscleMapper;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupEntity;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupMapper;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupRepository;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupType;
import com.avernet.myworkoutapi.user.UserEntity;
import com.avernet.myworkoutapi.userexercise.UserExerciseEntity;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ExerciseService {

    @Resource
    AuthService authService;

    @Resource
    ExerciseRepository exerciseRepository;

    @Resource
    MuscleGroupRepository muscleGroupRepository;

    @Resource
    ExerciseMapper exerciseMapper;

    @Resource
    MuscleGroupMapper muscleGroupMapper;

    @Resource
    ExerciseAddedToWorkoutMapper exerciseAddedToWorkoutMapper;

    @Resource
    MuscleMapper muscleMapper;


    @Transactional(readOnly = true)
    public MuscleGroupExercises findAllExercisesByMuscleGroupId(Long muscleGroupId) {
        MuscleGroupEntity muscleGroupEntity = muscleGroupRepository.findById(muscleGroupId).orElseThrow(MuscleGroupNotFoundException::new);

        List<ExerciseEntity> exerciseEntityList;

        Optional<UserEntity> userEntity = authService.optionalUser();
        if (userEntity.isPresent()) {
            exerciseEntityList = exerciseRepository.findExercisesByUserAndMuscleGroup(userEntity.get().getId(), muscleGroupId);
        } else {
            exerciseEntityList = exerciseRepository.findByMuscleGroup(muscleGroupId);
        }

        List<ExerciseAddedToWorkoutEntity> exerciseAddedToWorkoutEntityList = exerciseEntityList.stream()
            .map(exerciseEntity -> {
                UserExerciseEntity ue = exerciseEntity.getUserExercises()
                    .stream()
                    .filter(u -> {
                        Long userId = userEntity.map(UserEntity::getId).orElse(null);
                        return u.getUser().getId().equals(userId);
                    })
                    .findFirst()
                    .orElse(null);

                boolean ueExist = ue != null && ue.getId() != null;

                return new ExerciseAddedToWorkoutEntity(
                    exerciseEntity,
                    exerciseEntity.getExerciseMuscles().stream()
                        .map(ExerciseMuscleEntity::getMuscle).toList(),
                    ueExist,
                    ueExist ? ue.getOrder() : null
                );
            })
            .toList();

        Set<MuscleEntity> muscleList = exerciseEntityList.stream()
            .map(ExerciseEntity::getExerciseMuscles)
            .flatMap(List::stream)
            .map(ExerciseMuscleEntity::getMuscle)
            .collect(Collectors.toSet());

        return new MuscleGroupExercises(
            muscleGroupMapper.toDto(muscleGroupEntity),
            exerciseAddedToWorkoutMapper.toDtoList(exerciseAddedToWorkoutEntityList),
            muscleMapper.toDtoList(muscleList.stream().sorted(Comparator.comparing(MuscleEntity::getName)).toList())
        );
    }

    @Transactional(readOnly = true)
    public List<Exercise> findCardioExercises(UserEntity userEntity) {
        List<ExerciseEntity> exerciseEntityList = exerciseRepository.findCardioExercises(userEntity.getId(), MuscleGroupType.CARDIO);
        return exerciseMapper.toDtoList(exerciseEntityList);
    }

    @Transactional(readOnly = true)
    public ExerciseMuscle findExerciseMuscle(Long exerciseId) {
        ExerciseEntity exerciseEntity = exerciseRepository.findExercise(exerciseId);

        List<MuscleEntity> muscleEntityList = exerciseEntity.exerciseMuscles.stream()
            .map(ExerciseMuscleEntity::getMuscle)
            .sorted(Comparator.comparing(MuscleEntity::getName))
            .toList();

        return new ExerciseMuscle(
            exerciseMapper.toDto(exerciseEntity),
            muscleMapper.toDtoList(muscleEntityList)
        );
    }

    @Transactional
    public Exercise createOrUpdateExercise(ExerciseMuscle exerciseMuscle) {
        ExerciseEntity exerciseEntity = exerciseMapper.toEntity(exerciseMuscle.exercise());

        List<ExerciseMuscleEntity> exerciseMuscleEntityList = exerciseMuscle.muscles().stream()
                .map(muscle -> {
                    ExerciseMuscleEntity exerciseMuscleEntity = new ExerciseMuscleEntity();
                    exerciseMuscleEntity.setExercise(exerciseEntity);
                    exerciseMuscleEntity.setMuscle(muscleMapper.toEntity(muscle));
                    return exerciseMuscleEntity;
                })
            .toList();

        exerciseEntity.setExerciseMuscles(exerciseMuscleEntityList);
        exerciseRepository.save(exerciseEntity);

        return exerciseMapper.toDto(exerciseEntity);
    }
}

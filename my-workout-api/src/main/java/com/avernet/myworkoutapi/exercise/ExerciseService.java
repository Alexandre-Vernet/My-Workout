package com.avernet.myworkoutapi.exercise;

import com.avernet.myworkoutapi.auth.AuthService;
import com.avernet.myworkoutapi.error.ErrorCodeEnum;
import com.avernet.myworkoutapi.exception.ApiException;
import com.avernet.myworkoutapi.exercisemuscle.ExerciseMuscle;
import com.avernet.myworkoutapi.exercisemuscle.ExerciseMuscleAddedToWorkout;
import com.avernet.myworkoutapi.exercisemuscle.ExerciseMuscleEntity;
import com.avernet.myworkoutapi.muscle.MuscleEntity;
import com.avernet.myworkoutapi.muscle.MuscleMapper;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupEntity;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupEnum;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupMapper;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupNotFoundException;
import com.avernet.myworkoutapi.musclegroup.MuscleGroupRepository;
import com.avernet.myworkoutapi.user.UserEntity;
import com.avernet.myworkoutapi.userexercise.UserExerciseEntity;
import com.avernet.myworkoutapi.userexercise.UserExerciseRepository;
import jakarta.annotation.Resource;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
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
    private UserExerciseRepository userExerciseRepository;

    @Resource
    ExerciseMapper exerciseMapper;

    @Resource
    MuscleGroupMapper muscleGroupMapper;

    @Resource
    ExerciseAddedToWorkoutMapper exerciseAddedToWorkoutMapper;

    @Resource
    MuscleMapper muscleMapper;


    @Transactional(readOnly = true)
    public MuscleGroupExercises findAllExercisesByUserAndMuscleGroupId(UserEntity userEntity, Long muscleGroupId) {
        MuscleGroupEntity muscleGroupEntity = muscleGroupRepository.findById(muscleGroupId).orElseThrow(MuscleGroupNotFoundException::new);

        List<ExerciseEntity> exerciseEntityList = exerciseRepository.findExercisesByUserAndMuscleGroup(userEntity.getId(), muscleGroupId);

        List<ExerciseAddedToWorkoutEntity> exerciseAddedToWorkoutEntityList = exerciseEntityList.stream()
            .map(exerciseEntity -> {
                UserExerciseEntity userExerciseEntity = exerciseEntity.getUserExercises()
                    .stream()
                    .filter(u -> u.getUser().getId().equals(userEntity.getId()))
                    .findFirst()
                    .orElse(null);

                boolean ueExist = userExerciseEntity != null && userExerciseEntity.getId() != null;

                return new ExerciseAddedToWorkoutEntity(
                    exerciseEntity,
                    exerciseEntity.getExerciseMuscles().stream()
                        .map(ExerciseMuscleEntity::getMuscle).toList(),
                    ueExist,
                    ueExist ? userExerciseEntity.getOrder() : null
                );
            })
            .toList();

        return getMuscleGroupExercises(muscleGroupEntity, exerciseEntityList, exerciseAddedToWorkoutEntityList);
    }

    @Transactional(readOnly = true)
    public MuscleGroupExercises findAllExercisesByMuscleGroupId(Long muscleGroupId) {
        MuscleGroupEntity muscleGroupEntity = muscleGroupRepository.findById(muscleGroupId).orElseThrow(MuscleGroupNotFoundException::new);

        List<ExerciseEntity> exerciseEntityList = exerciseRepository.findByMuscleGroup(muscleGroupId);

        List<ExerciseAddedToWorkoutEntity> exerciseAddedToWorkoutEntityList = exerciseEntityList.stream()
            .map(exerciseEntity -> new ExerciseAddedToWorkoutEntity(
                exerciseEntity,
                exerciseEntity.getExerciseMuscles().stream()
                    .map(ExerciseMuscleEntity::getMuscle).toList(),
                false,
                null
            ))
            .toList();

        return getMuscleGroupExercises(muscleGroupEntity, exerciseEntityList, exerciseAddedToWorkoutEntityList);
    }

    @Transactional(readOnly = true)
    public List<Exercise> findCardioExercises(UserEntity userEntity) {
        List<ExerciseEntity> exerciseEntityList = exerciseRepository.findCardioExercises(userEntity.getId(), MuscleGroupEnum.CARDIO);
        return exerciseMapper.toDtoList(exerciseEntityList);
    }

    @Transactional(readOnly = true)
    public ExerciseMuscleAddedToWorkout findExercisesMuscle(Long exerciseId) {
        ExerciseEntity exerciseEntity = exerciseRepository.findExercise(exerciseId);

        List<MuscleEntity> muscleEntityList = exerciseEntity.exerciseMuscles.stream()
            .map(ExerciseMuscleEntity::getMuscle)
            .sorted(Comparator.comparing(MuscleEntity::getName))
            .toList();

        Boolean addedToWorkout = Boolean.FALSE;
        Optional<UserEntity> userEntity = authService.optionalUser();
        if (userEntity.isPresent()) {
            addedToWorkout = userExerciseRepository.existsByExerciseAndUser(exerciseEntity, userEntity.get());
        }

        return new ExerciseMuscleAddedToWorkout(
            exerciseMapper.toDto(exerciseEntity),
            muscleMapper.toDtoList(muscleEntityList),
            addedToWorkout
        );
    }

    @Transactional
    public Exercise createOrUpdateExercise(ExerciseMuscle exerciseMuscle) {
        if (exerciseMuscle.exercise().getId() == null) {
            boolean exerciseNameExist = exerciseRepository.existsByName(exerciseMuscle.exercise().getName());
            if (exerciseNameExist) {
                throw new ApiException(ErrorCodeEnum.EXERCISE_NAME_ALREADY_EXIST, "Cet exercice existe déjà", HttpStatus.CONFLICT);
            }
        }

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


    @NonNull
    private MuscleGroupExercises getMuscleGroupExercises(MuscleGroupEntity muscleGroupEntity, List<ExerciseEntity> exerciseEntityList, List<ExerciseAddedToWorkoutEntity> exerciseAddedToWorkoutEntityList) {
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
}

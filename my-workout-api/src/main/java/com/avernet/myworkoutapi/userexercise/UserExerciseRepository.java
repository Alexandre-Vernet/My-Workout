package com.avernet.myworkoutapi.userexercise;

import com.avernet.myworkoutapi.exercise.ExerciseEntity;
import com.avernet.myworkoutapi.user.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserExerciseRepository extends JpaRepository<UserExerciseEntity, Long> {

    UserExerciseEntity findByUserIdAndExerciseId(Long userId, Long exerciseId);

    Boolean existsByExerciseAndUser(ExerciseEntity exercise, UserEntity user);

    @Query("""
            SELECT COALESCE(MAX(ue.order), 0) + 1 FROM UserExerciseEntity ue
                    JOIN ue.exercise e
                    JOIN ue.user u
                    JOIN e.exerciseMuscles em
                    JOIN em.muscle m
                    JOIN m.muscleGroup mg
                WHERE ue.user.id = :userId
                AND mg.id = :muscleGroupId
        """)
    Integer getOrder(@Param("userId") Long userId, @Param("muscleGroupId") Integer muscleGroupId);

    @Query("""
    SELECT ue
    FROM UserExerciseEntity ue
    WHERE ue.user.id = :userId
      AND ue.exercise.id <> :exerciseId
      AND ue.order = :order
      AND EXISTS (
          SELECT 1
          FROM ExerciseMuscleEntity em
          JOIN em.muscle m
          WHERE em.exercise.id = ue.exercise.id
            AND m.muscleGroup.id = :muscleGroupId
      )
""")
    Optional<UserExerciseEntity> findByUserExerciseAndMuscleGroup(
        @Param("userId") Long userId,
        @Param("exerciseId") Long exerciseId,
        @Param("order") Integer order,
        @Param("muscleGroupId") Integer muscleGroupId
    );
}

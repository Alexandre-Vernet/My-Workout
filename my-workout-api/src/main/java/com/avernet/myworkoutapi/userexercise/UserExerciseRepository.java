package com.avernet.myworkoutapi.userexercise;

import com.avernet.myworkoutapi.exercise.ExerciseEntity;
import com.avernet.myworkoutapi.user.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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
}

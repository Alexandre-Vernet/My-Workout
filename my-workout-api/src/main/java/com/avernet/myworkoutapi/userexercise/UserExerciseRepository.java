package com.avernet.myworkoutapi.userexercise;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserExerciseRepository extends JpaRepository<UserExerciseEntity, Long> {

    UserExerciseEntity findByUserIdAndExerciseId(Long userId, Long exerciseId);

    @Query("""
            SELECT ue
                FROM UserExerciseEntity ue
                LEFT JOIN ue.exercise e
                LEFT JOIN ue.user u
                LEFT JOIN e.exerciseMuscles em
                LEFT JOIN em.muscle m
                LEFT JOIN m.muscleGroup mg
                WHERE u.id = :userId
                AND mg.id = :muscleGroupId
                ORDER BY ue.order ASC, e.id ASC
        """)
    List<UserExerciseEntity> findAddedExercisesByMuscleGroupId(@Param("userId") Long userId, @Param("muscleGroupId") Integer muscleGroupId);
}

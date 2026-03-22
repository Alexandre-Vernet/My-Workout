package com.avernet.myworkoutapi.exercise;

import com.avernet.myworkoutapi.musclegroup.MuscleGroupType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<ExerciseEntity, Long> {

    @Query("""
        SELECT e
        FROM ExerciseEntity e
        LEFT JOIN FETCH e.exerciseMuscles em
        LEFT JOIN FETCH em.muscle m
        LEFT JOIN m.muscleGroup mg
        LEFT JOIN e.userExercises ue ON ue.user.id = :userId
        WHERE mg.id = :muscleGroup
        ORDER BY ue.order ASC, e.id ASC
    """)
    List<ExerciseEntity> findAllExercisesByUserAndMuscleGroup(@Param("userId") Long userId, @Param("muscleGroup") Long muscleGroup);

    @Query("""
        SELECT e
            FROM ExerciseEntity e
            LEFT JOIN e.userExercises ue
            LEFT JOIN e.exerciseMuscles em
            LEFT JOIN em.muscle m
            LEFT JOIN m.muscleGroup mg
            where ue.user.id = :userId
            and mg.name = :cardio
    """)
    List<ExerciseEntity> findCardioExercises(@Param("userId") Long userId, @Param("cardio") MuscleGroupType cardio);

    @Query("""
        SELECT DISTINCT new com.avernet.myworkoutapi.exercise.ExerciseOrderEntity(e, ue.order)
            FROM ExerciseEntity e
            LEFT JOIN e.userExercises ue
            LEFT JOIN ue.user u
            LEFT JOIN e.exerciseMuscles em
            LEFT JOIN em.muscle m
            LEFT JOIN m.muscleGroup mg
            WHERE u.id = :userId
            AND mg.id = :muscleGroupId
            ORDER BY ue.order ASC
    """)
    List<ExerciseOrderEntity> findAddedExercisesByMuscleGroupId(@Param("userId") Long userId, @Param("muscleGroupId") Integer muscleGroupId);

    @Query("""
        SELECT e
            FROM ExerciseEntity e
            LEFT JOIN e.userExercises ue
            LEFT JOIN ue.user u
            LEFT JOIN e.exerciseMuscles em
            LEFT JOIN em.muscle m
            LEFT JOIN m.muscleGroup mg
            WHERE mg.id = :muscleGroupId
            ORDER BY e.id ASC
    """)
    List<ExerciseEntity> findByMuscleGroup(Long muscleGroupId);

    @Query("""
        SELECT e
            FROM ExerciseEntity e
            LEFT JOIN FETCH e.exerciseMuscles em
            LEFT JOIN FETCH em.muscle m
            WHERE e.id = :exerciseId
    """)
    ExerciseEntity findExercise(@Param("exerciseId") Long exerciseId);
}

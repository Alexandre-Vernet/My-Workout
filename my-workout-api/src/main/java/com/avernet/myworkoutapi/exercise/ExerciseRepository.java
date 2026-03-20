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
             SELECT DISTINCT new com.avernet.myworkoutapi.exercise.ExerciseAddedToWorkoutEntity(
                    exercise,
                    CASE WHEN ue.id IS NOT NULL THEN true ELSE false END,
                    ue.order
                )
                FROM ExerciseEntity exercise
                LEFT JOIN exercise.exerciseMuscleList exerciseMuscle
                LEFT JOIN exerciseMuscle.muscle muscle
                LEFT JOIN muscle.muscleGroup muscleGroup
                LEFT JOIN exercise.userExerciseList ue
                WHERE muscleGroup.id = :muscleGroup
        """)
    List<ExerciseAddedToWorkoutEntity> findAllExercisesByMuscleGroupId(@Param("muscleGroup") Long muscleGroup);

    @Query("""
        SELECT exercise
            FROM ExerciseEntity exercise
            LEFT JOIN exercise.userExerciseList userExercise
            LEFT JOIN exercise.exerciseMuscleList exerciseMucle
            LEFT JOIN exerciseMucle.muscle muscle
            LEFT JOIN muscle.muscleGroup muscleGroup
            where userExercise.user.id = :userId
            and muscleGroup.name = :cardio
    """)
    List<ExerciseEntity> findCardioExercises(@Param("userId") Long userId, @Param("cardio") MuscleGroupType cardio);

    @Query("""
        SELECT DISTINCT new com.avernet.myworkoutapi.exercise.ExerciseOrderEntity(e, ue.order)
            FROM ExerciseEntity e
            LEFT JOIN e.userExerciseList ue
            LEFT JOIN ue.user u
            LEFT JOIN e.exerciseMuscleList em
            LEFT JOIN em.muscle m
            LEFT JOIN m.muscleGroup mg
            WHERE u.id = :userId
            AND mg.id = :muscleGroupId
            ORDER BY ue.order ASC
    """)
    List<ExerciseOrderEntity> findAddedExercisesByMuscleGroupId(@Param("userId") Long userId, @Param("muscleGroupId") Integer muscleGroupId);
}

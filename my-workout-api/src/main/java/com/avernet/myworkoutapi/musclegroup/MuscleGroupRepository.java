package com.avernet.myworkoutapi.musclegroup;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MuscleGroupRepository extends JpaRepository<MuscleGroupEntity, Long> {

    @Query("""
        SELECT new com.avernet.myworkoutapi.musclegroup.MuscleGroupExerciseCountEntity(muscleGroup, count(distinct userExercise.id), MAX(workout.date))
            FROM MuscleGroupEntity muscleGroup
            LEFT JOIN muscleGroup.muscleList muscle
            LEFT JOIN muscle.exerciseMuscles exerciseMuscle
            LEFT JOIN exerciseMuscle.exercise exercise
            LEFT JOIN exercise.userExercises userExercise
                ON userExercise.user.id = :userId
            LEFT JOIN muscleGroup.workouts workout
                ON workout.user.id = :userId
            GROUP BY muscleGroup.id
    """)
    List<MuscleGroupExerciseCountEntity> findAllMuscleGroupAndCountAddedExercises(@Param("userId") Long userId);

    @Query("""
    SELECT mg FROM ExerciseEntity e
        LEFT JOIN e.exerciseMuscles em
        LEFT JOIN em.muscle m
        LEFT JOIN m.muscleGroup mg
        WHERE e.id = :exerciseId
    """)
    MuscleGroupEntity findByExercise(@Param("exerciseId") Long exerciseId);
}

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
            SELECT exercise
            FROM ExerciseEntity exercise
            JOIN FETCH exercise.exerciseMuscleList exerciseMuscle
            JOIN FETCH exerciseMuscle.muscle muscle
            JOIN muscle.muscleGroup muscleGroup
            WHERE muscleGroup.id = :muscleGroup
        """)
    List<ExerciseEntity> findAllByMuscleGroup(@Param("muscleGroup") Long muscleGroup);

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
}

package com.avernet.myworkoutapi.musclegroup;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MuscleGroupRepository extends JpaRepository<MuscleGroupEntity, Long> {

    @Query("""
        SELECT new com.avernet.myworkoutapi.musclegroup.MuscleGroupExerciseCountEntity(muscleGroup, count(userExercise.exercise.id))
            FROM MuscleGroupEntity muscleGroup
            LEFT JOIN muscleGroup.muscleList muscle
            LEFT JOIN muscle.exerciseMuscleList exerciseMuscle
            LEFT JOIN exerciseMuscle.exercise exercise
            LEFT JOIN exercise.userExerciseList userExercise
            WHERE userExercise.user.id = :userId
            GROUP BY muscleGroup.id
    """)
    List<MuscleGroupExerciseCountEntity> findAllMuscleGroupAndCountAddedExercises(@Param("userId") Long userId);
}

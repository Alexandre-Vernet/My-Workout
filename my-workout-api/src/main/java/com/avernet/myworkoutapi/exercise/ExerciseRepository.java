package com.avernet.myworkoutapi.exercise;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<ExerciseEntity, Long> {

    @Query("""
        SELECT exercise
             from MuscleGroupEntity muscleGroup
             join muscleGroup.muscle muscle
             join muscle.exerciseMuscle exerciseMuscle
             join exerciseMuscle.exercise exercise
                 where muscleGroup.id = :muscleGroup
        """)
    List<ExerciseEntity> findAllByMuscleGroup(@Param("muscleGroup") Long muscleGroup);
}

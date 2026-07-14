package com.avernet.myworkoutapi.exercise;

import com.avernet.myworkoutapi.musclegroup.MuscleGroupEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<ExerciseEntity, Long> {

    @Query("""
        SELECT DISTINCT e from ExerciseEntity e
            JOIN FETCH e.exerciseMuscles em
            JOIN FETCH em.muscle
            ORDER BY e.name
        """)
    List<ExerciseEntity> findAllExerciseMuscle();

    @Query(value = """
        SELECT DISTINCT e.*
        FROM exercises e
            JOIN exercise_muscle em ON em.exercise_id = e.id
            JOIN muscles m ON m.id = em.muscle_id
        WHERE unaccent(lower(e.name)) LIKE unaccent(lower(:search))
        ORDER by e.name
        """,
        nativeQuery = true)
    List<ExerciseEntity> searchExercises(@Param("search") String search);

    @Query("""
        SELECT e from ExerciseEntity e
            JOIN FETCH e.exerciseMuscles em
            JOIN FETCH em.muscle m
            JOIN FETCH m.muscleGroup mg
            WHERE mg.id = :muscleGroup
            ORDER BY e.name
        """)
    List<ExerciseEntity> findExercisesByMuscleGroup(@Param("muscleGroup") Long muscleGroup);

    @Query("""
        SELECT e
        FROM ExerciseEntity e
        JOIN e.exerciseMuscles em
        JOIN em.muscle m
        JOIN m.muscleGroup mg
        JOIN e.userExercises ue
        WHERE ue.user.id = :userId
        ORDER BY e.name ASC
    """)
    List<ExerciseEntity> findExercisesByUser(@Param("userId") Long userId);

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
    List<ExerciseEntity> findCardioExercises(@Param("userId") Long userId, @Param("cardio") MuscleGroupEnum cardio);


    @Query("""
            SELECT e
                FROM ExerciseEntity e
                LEFT JOIN FETCH e.exerciseMuscles em
                LEFT JOIN FETCH em.muscle m
                WHERE e.id = :exerciseId
        """)
    ExerciseEntity findExercise(@Param("exerciseId") Long exerciseId);

    boolean existsByName(String name);
}

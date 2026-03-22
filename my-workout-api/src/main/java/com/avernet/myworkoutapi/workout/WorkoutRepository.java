package com.avernet.myworkoutapi.workout;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkoutRepository extends JpaRepository<WorkoutEntity, Long> {

    Optional<WorkoutEntity> findByUserIdAndMuscleGroupIdAndDate(Long userId, Integer muscleGroupId, LocalDate date);

    @Query("""
        select w from WorkoutEntity w
            left join fetch w.histories
            where w.user.id = :userId
            and w.date BETWEEN :start and :end
        """)
    List<WorkoutEntity> findByUserIdAndDateBetween(@Param("userId") Long userId, @Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("""
    SELECT w from WorkoutEntity w
        left join fetch w.histories h
        left join fetch h.exercise
        left join fetch w.muscleGroup
        where w.id = :id
    """)
    WorkoutEntity test(@Param("id") Long id);

    Integer countByUserId(Long userId);

    void deleteByIdAndUserId(Long id, Long userId);
}

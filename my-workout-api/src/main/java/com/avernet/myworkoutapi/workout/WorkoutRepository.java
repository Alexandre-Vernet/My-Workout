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
        SELECT w FROM WorkoutEntity w
            LEFT JOIN FETCH w.histories
            WHERE w.user.id = :userId
            AND w.date BETWEEN :start and :end
        """)
    List<WorkoutEntity> findByUserIdAndDateBetween(@Param("userId") Long userId, @Param("start") LocalDate start, @Param("end") LocalDate end);

    Integer countByUserId(Long userId);

    void deleteByIdAndUserId(Long id, Long userId);
}

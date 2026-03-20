package com.avernet.myworkoutapi.history;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HistoryRepository extends JpaRepository<HistoryEntity, Long> {

    @Query("""
        SELECT h FROM HistoryEntity h
        LEFT JOIN h.workout w
        LEFT JOIN h.exercise e
        WHERE e.id = :exerciseId
        AND w.user.id = :userId
        ORDER BY w.date DESC, h.id ASC
        LIMIT 1
    """)
    HistoryEntity findFirstByExerciseIdAndWorkoutUserIdOrderByWorkoutDate(@Param("userId") Long userId, @Param("exerciseId") Long exerciseId);

    @Query("""
        SELECT h FROM HistoryEntity h
        JOIN h.workout w
        JOIN h.exercise e
        WHERE w.user.id = :userId
        AND e.id = :exerciseId
        AND w.muscleGroup.id = :muscleGroupId
        AND w.date = :today
        ORDER BY h.id ASC
    """)
    List<HistoryEntity> findTodayExercices(@Param("userId") Long userId, @Param("muscleGroupId") Long muscleGroupId,
                                           @Param("exerciseId") Long exerciseId,
                                           @Param("today") LocalDate today);
}

package com.avernet.myworkoutapi.history;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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
    HistoryEntity findFirstByExerciseIdAndWorkoutUserIdOrderByWorkoutDate(@Param("exerciseId") Long exerciseId, @Param("userId") Long userId);
}

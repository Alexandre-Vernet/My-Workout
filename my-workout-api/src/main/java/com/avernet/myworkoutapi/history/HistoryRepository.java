package com.avernet.myworkoutapi.history;

import com.avernet.myworkoutapi.history.stats.exercisegraphs.ExerciseGraphsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface HistoryRepository extends JpaRepository<HistoryEntity, Long> {

    @Query("""
            SELECT h FROM HistoryEntity h
            JOIN h.workout w
            WHERE h.id = :historyId
            AND w.user.id = :userId
        """)
    Optional<HistoryEntity> findByIdAndWorkoutUserId(@Param("historyId") Long historyId, @Param("userId") Long userId);

    // Prefers the last history recorded at the given gym, but falls back to the last
    // history at any gym when there's none for that gym yet (e.g. a gym just created,
    // or history recorded before this user had more than one) — this is a silent
    // pre-fill suggestion, so it should never come up empty just because the exact gym
    // has no data yet. Unlike this query, the stats/graphs queries below filter
    // strictly: there, the gym is an explicit filter the user picked, not a preference.
    @Query("""
            SELECT h FROM HistoryEntity h
            LEFT JOIN h.workout w
            LEFT JOIN h.exercise e
            WHERE e.id = :exerciseId
            AND w.user.id = :userId
            ORDER BY CASE WHEN :gymId IS NOT NULL AND w.gym.id = :gymId THEN 0 ELSE 1 END, w.date DESC, h.id ASC
            LIMIT 1
        """)
    HistoryEntity findFirstByExerciseIdAndWorkoutUserIdAndGymIdOrderByWorkoutDate(
        @Param("userId") Long userId, @Param("exerciseId") Long exerciseId, @Param("gymId") Long gymId
    );

    @Query("""
            SELECT h FROM HistoryEntity h
            JOIN h.workout w
            JOIN h.exercise e
            WHERE w.user.id = :userId
            AND e.id = :exerciseId
            AND w.muscleGroup.id = :muscleGroupId
            AND w.date >= :startOfDay
            AND w.date < :endOfDay
            ORDER BY h.id ASC
        """)
    List<HistoryEntity> findTodayHistories(
        @Param("userId") Long userId, @Param("muscleGroupId") Long muscleGroupId,
        @Param("exerciseId") Long exerciseId,
        @Param("startOfDay") LocalDateTime startOfDay,
        @Param("endOfDay") LocalDateTime endOfDay
    );

    @Query("""
            SELECT new com.avernet.myworkoutapi.history.stats.exercisegraphs.ExerciseGraphsEntity(
                h.exercise,
                SUM(h.weight),
                MAX(h.weight),
                SUM(h.reps)
            )
            FROM HistoryEntity h
            JOIN h.workout w
            WHERE w.user.id = :userId
            AND h.exercise.id = :exerciseId
            AND (:gymId IS NULL OR w.gym.id = :gymId)
            GROUP BY h.exercise
        """)
    ExerciseGraphsEntity getExerciseGraphs(@Param("userId") Long userId, @Param("exerciseId") Long exerciseId, @Param("gymId") Long gymId);

    @Query("""
            SELECT h
            FROM HistoryEntity h
            JOIN h.workout w
            WHERE w.user.id = :userId
            AND h.exercise.id = :exerciseId
            AND (:gymId IS NULL OR w.gym.id = :gymId)
            ORDER BY h.workout.date ASC
        """)
    List<HistoryEntity> findHistoriesByUserAndExercise(@Param("userId") Long userId, @Param("exerciseId") Long exerciseId, @Param("gymId") Long gymId);
}

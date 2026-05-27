package com.avernet.myworkoutapi.workout;

import com.avernet.myworkoutapi.user.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkoutRepository extends JpaRepository<WorkoutEntity, Long> {

    Optional<WorkoutEntity> findByUserIdAndMuscleGroupIdAndDateGreaterThanEqualAndDateLessThan(
        Long userId,
        Integer muscleGroupId,
        LocalDateTime startDay,
        LocalDateTime endDay
    );

    @Query("""
        SELECT w FROM WorkoutEntity w
            LEFT JOIN FETCH w.histories
                WHERE w.user.id = :userId
                AND w.date BETWEEN :start and :end
        """)
    List<WorkoutEntity> findByUserIdAndDateBetween(@Param("userId") Long userId,
                                                   @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    Long countByUserId(Long userId);

    void deleteByIdAndUserId(Long id, Long userId);

    Optional<WorkoutEntity> findByIdAndUser(Long id, UserEntity user);
}

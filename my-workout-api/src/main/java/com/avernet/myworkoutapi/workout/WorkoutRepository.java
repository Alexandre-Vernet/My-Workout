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

    Optional<WorkoutEntity> findByUserIdAndMuscleGroupIdAndDate(Long userId, Long muscleGroupId, LocalDate date);

    @Query("""
        select w from WorkoutEntity w
            left join fetch w.historyList
            where w.user.id = :userId
            and w.date BETWEEN :start and :end
        """)
    List<WorkoutEntity> findByUserIdAndDateBetween(@Param("userId") Long userId, @Param("start") LocalDate start, @Param("end") LocalDate end);

    Integer countByUserId(Long userId);
}
